import { NextRequest, NextResponse } from "next/server";
import * as cheerioLib from "cheerio";
import type { AnyNode } from "domhandler";

export const dynamic = "force-dynamic";

interface ScrapedMetadata {
  title: string;
  description: string;
  price?: number;
  compareAtPrice?: number;
  currency?: string;
  images: string[];
  vendor?: string;
  availability?: string;
  url: string;
  features: string[];
  shippingInfo: string[];
  badges: string[];
  variants?: Array<{
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    available: boolean;
  }>;
  error?: string;
}

import { CURRENCY_MAP, syncLatestRates } from "@/lib/currency";

async function parsePrice(priceStr: string | undefined, taxMultiplier: number = 1.0): Promise<number | undefined> {
  if (!priceStr) return undefined;
  const cleaned = priceStr.replace(/[^0-9.,]/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  if (isNaN(num)) return undefined;

  // Actualizamos los rates para ser lo más exactos posibles
  await syncLatestRates();
  
  // Asumimos que los precios vienen en Peso Dominicano (DOP) ya que se scrappea de allí
  const dopRate = CURRENCY_MAP["DO"].rate;

  // Convertimos el precio DOP a dólares, y luego a centavos de USD (nuestro formato interno).
  // Si el usuario quiere dropshipping, aquí es donde lo convertimos a la moneda base.
  // Ejemplo: 1500 DOP / 60 = 25 USD -> 2500 centavos
  const usdCents = (num / dopRate) * 100 * taxMultiplier;
  
  return Math.round(usdCents);
}

function normalizeImage(src: string, baseUrl: string): string {
  if (!src) return "";
  if (src.startsWith("//")) return `https:${src}`;
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) {
    const url = new URL(baseUrl);
    return `${url.protocol}//${url.host}${src}`;
  }
  return src;
}

/** Intenta extraer datos desde la Shopify JSON API (products.json o product.json) */
async function tryShopifyAPI(pageUrl: URL, taxMultiplier: number = 1.0): Promise<ScrapedMetadata | null> {
  try {
    // Shopify expone el producto como /products/{handle}.json
    const handle = pageUrl.pathname.replace(/\/$/, "").split("/").pop();
    if (!handle) return null;

    const jsonUrl = `${pageUrl.protocol}//${pageUrl.host}/products/${handle}.json`;
    console.log("[SCRAPE] Trying Shopify API:", jsonUrl);

    const res = await fetch(jsonUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ProductScraper/1.0)",
        Accept: "application/json",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const p = data?.product;
    if (!p) return null;

    console.log("[SCRAPE] Shopify product found:", p.title);

    const images: string[] = (p.images || [])
      .map((img: { src: string }) => img.src)
      .filter(Boolean);

    const variants = await Promise.all(
      (p.variants || []).map(async (v: {
        id: number;
        title: string;
        price: string;
        compare_at_price: string | null;
        available: boolean;
      }) => ({
        id: String(v.id),
        title: v.title,
        price: (await parsePrice(v.price, taxMultiplier)) ?? 0,
        compareAtPrice: v.compare_at_price ? await parsePrice(v.compare_at_price, taxMultiplier) : undefined,
        available: v.available ?? true,
      }))
    );

    const cheapest = variants.reduce(
      (min: typeof variants[0], v: typeof variants[0]) => (!min || v.price < min.price ? v : min),
      null
    );

    // Strip HTML from description
    const descHtml = p.body_html || "";
    const cleanDesc = descHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    // Extract features/badges from description HTML
    const features = extractFeaturesFromHtml(descHtml);

    return {
      title: p.title || "",
      description: cleanDesc.substring(0, 800),
      price: cheapest?.price,
      compareAtPrice: cheapest?.compareAtPrice,
      currency: "USD",
      images,
      vendor: p.vendor || "",
      availability: variants.some((v: typeof variants[0]) => v.available) ? "in stock" : "out of stock",
      url: pageUrl.href,
      features,
      shippingInfo: [],
      badges: typeof p.tags === "string" ? p.tags.split(",").map((t: string) => t.trim()) : (p.tags || []),
      variants,
    };
  } catch (e) {
    console.log("[SCRAPE] Shopify API failed:", e);
    return null;
  }
}

/** Extrae listas de características desde el body HTML del producto */
function extractFeaturesFromHtml(html: string): string[] {
  const $ = cheerioLib.load(html);

  const features: string[] = [];
  const seen = new Set<string>();

  // Busca íconos + texto (patrón común en Shopify para badges)
  $("li, p, span, div").each((_: number, el: AnyNode) => {
    const text = $(el).text().trim();
    // Características cortas (2-80 chars), no repetidas, sin HTML tags
    if (
      text.length >= 2 &&
      text.length <= 80 &&
      !seen.has(text) &&
      !text.includes("{") // no templates
    ) {
      const children = $(el).children().length;
      const parentTag = (el as AnyNode & { tagName?: string })?.tagName;

      // Prioriza elementos de lista y elementos con íconos
      if (
        parentTag === "li" ||
        $(el).find("img, svg, i").length > 0 ||
        children <= 2
      ) {
        // Filtra líneas que parecen features/badges (no párrafos largos)
        const wordCount = text.split(" ").length;
        if (wordCount <= 8) {
          features.push(text);
          seen.add(text);
        }
      }
    }
  });

  return features.slice(0, 15);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { url, taxRate } = body;

    const rate = taxRate ? parseFloat(taxRate) : 1.0;

    console.log("[SCRAPE] Received URL:", url, "Tax Rate:", rate);

    if (!url) {
      return NextResponse.json({ error: "URL es requerida" }, { status: 400 });
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    // --- Intento 1: Shopify JSON API (más preciso) ---
    const shopifyData = await tryShopifyAPI(parsedUrl, rate);
    if (shopifyData) {
      // Normalizar imágenes
      shopifyData.images = shopifyData.images
        .map((img) => normalizeImage(img, url))
        .filter(Boolean);
      return NextResponse.json(shopifyData);
    }

    // --- Intento 2: HTML scraping genérico ---
    console.log("[SCRAPE] Falling back to HTML scraping:", parsedUrl.href);

    const response = await fetch(parsedUrl.href, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "es,en-US;q=0.7,en;q=0.3",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `La URL retornó error ${response.status}. Algunas tiendas tienen protección anti-scraping.` },
        { status: response.status }
      );
    }

    const html = await response.text();
    const cheerio = await import("cheerio");
    const $ = cheerio.load(html);

    const metadata: ScrapedMetadata = {
      title: "",
      description: "",
      images: [],
      url,
      features: [],
      shippingInfo: [],
      badges: [],
    };

    // Title
    metadata.title =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("title").text() ||
      $("h1").first().text() ||
      "";

    // Description
    metadata.description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";

    // Price (sale price)
    const priceSelectors = [
      'meta[property="product:price:amount"]',
      'meta[property="og:price:amount"]',
      '[itemprop="price"]',
      ".price__sale .price-item--sale",
      ".price--sale",
      ".sale-price",
      ".price",
    ];
    for (const sel of priceSelectors) {
      const el = $(sel).first();
      const val = el.attr("content") || el.attr("data-price") || el.text();
      if (val) {
        metadata.price = await parsePrice(val, rate);
        if (metadata.price) break;
      }
    }

    // Compare-at price (precio tachado)
    const compareSelectors = [
      ".price__compare .price-item--regular",
      ".compare-at-price",
      ".price--compare",
      "[itemprop='highPrice']",
      ".was-price",
      "del .price-item",
      "s.price",
    ];
    for (const sel of compareSelectors) {
      const el = $(sel).first();
      const val = el.attr("content") || el.text();
      if (val) {
        metadata.compareAtPrice = await parsePrice(val, rate);
        if (metadata.compareAtPrice) break;
      }
    }

    // Currency
    metadata.currency =
      $('meta[property="product:price:currency"]').attr("content") ||
      $('meta[property="og:price:currency"]').attr("content") || "USD";

    // Images
    const ogImage = $('meta[property="og:image"]').attr("content");
    if (ogImage) metadata.images.push(normalizeImage(ogImage, url));

    const imgSelectors = [
      ".product-gallery img",
      ".product__media img",
      ".product-image img",
      ".main-image img",
      "[itemprop='image']",
    ];
    for (const sel of imgSelectors) {
      $(sel).each((_: number, el: AnyNode) => {
        const src =
          $(el).attr("src") ||
          $(el).attr("data-src") ||
          $(el).attr("data-srcset")?.split(",")[0]?.trim().split(" ")[0];
        if (src) {
          const normalized = normalizeImage(src, url);
          if (normalized && !metadata.images.includes(normalized)) {
            metadata.images.push(normalized);
          }
        }
      });
    }

    // Vendor
    metadata.vendor =
      $('meta[property="product:brand"]').attr("content") ||
      $('meta[property="og:site_name"]').attr("content") ||
      $("[itemprop='brand']").attr("content") || "";

    // Features / badges (íconos con texto)
    const featureSelectors = [
      ".product-features li",
      ".product-badges li",
      ".product__badges li",
      ".product-meta__features li",
      ".features li",
      ".product__features li",
      ".product-callouts li",
      ".icon-list li",
      "[class*='feature'] li",
      "[class*='badge'] li",
    ];
    for (const sel of featureSelectors) {
      $(sel).each((_: number, el: AnyNode) => {
        const text = $(el).text().trim();
        if (text && text.length <= 80 && !metadata.features.includes(text)) {
          metadata.features.push(text);
        }
      });
    }

    // Shipping info
    const shippingSelectors = [
      ".product__shipping",
      ".shipping-info",
      "[class*='shipping'] p",
      "[class*='delivery']",
      ".product-delivery",
    ];
    for (const sel of shippingSelectors) {
      $(sel).each((_: number, el: AnyNode) => {
        const text = $(el).text().trim();
        if (text && text.length <= 120 && !metadata.shippingInfo.includes(text)) {
          metadata.shippingInfo.push(text);
        }
      });
    }

    // Availability
    metadata.availability =
      $('meta[property="product:availability"]').attr("content") ||
      $('link[itemprop="availability"]').attr("href") ||
      "";

    // Clean
    metadata.title = metadata.title.trim();
    metadata.description = metadata.description.trim().substring(0, 800);
    metadata.vendor = metadata.vendor.trim();

    if (!metadata.title) {
      return NextResponse.json(
        { error: "No se pudo extraer información. La página podría tener protección anti-scraping o ser dinámica (JavaScript)." },
        { status: 422 }
      );
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Scraper error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";

    if (msg.includes("fetch failed") || msg.includes("UNABLE_TO_GET_ISSUER_CERT")) {
      return NextResponse.json(
        { error: "La URL no es accesible desde el servidor." },
        { status: 502 }
      );
    }

    return NextResponse.json({ error: `Error interno: ${msg}` }, { status: 500 });
  }
}
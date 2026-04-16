import { NextRequest, NextResponse } from "next/server";
import type { Product, ProductImage, ProductVariant } from "@/lib/types";

// In-memory store for demo (would be Medusa in production)
let products: Product[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  
  let filteredProducts = products;
  
  if (featured === "true") {
    filteredProducts = products.filter(p => p.status === "published");
  }
  
  return NextResponse.json({ products: filteredProducts });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      title,
      description,
      price,
      images,
      vendor,
      handle,
      options,
      variants,
    } = body;

    // Validate required fields
    if (!title) {
      return NextResponse.json(
        { error: "Title es requerido" },
        { status: 400 }
      );
    }

    // Generate handle if not provided
    const productHandle = handle || title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Create product images
    const productImages: ProductImage[] = (images || []).map((url: string, index: number) => ({
      id: `img_${Date.now()}_${index}`,
      url,
    }));

    // Create product options
    const defaultOption = { name: "Default", values: ["Default"] };
    const productOptions = (options || [defaultOption]).map((opt: { name: string; values: string[] }, index: number) => ({
      id: `opt_${Date.now()}_${index}`,
      name: opt.name,
      values: opt.values,
    }));

    // Create variants
    const productVariants: ProductVariant[] = (variants || []).map((variant: { title: string; price: number; sku?: string; inventoryQuantity?: number; options?: Record<string, string> }, index: number) => ({
      id: `var_${Date.now()}_${index}`,
      title: variant.title || productOptions[0]?.values[0] || "Default",
      price: variant.price || price || 0,
      sku: variant.sku,
      inventoryQuantity: variant.inventoryQuantity || 10,
      options: variant.options || {},
    }));

    // Calculate price range
    const prices = productVariants.map(v => v.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : price || 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : price || 0;

    // Create the product
    const newProduct: Product = {
      id: `prod_${Date.now()}`,
      title,
      handle: productHandle,
      description: description || "",
      vendor: vendor || "Naturista",
      productType: "General",
      tags: [],
      status: "published",
      images: productImages,
      thumbnail: productImages[0]?.url || "",
      variants: productVariants,
      options: productOptions,
      priceRange: { minPrice, maxPrice },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to store
    products.push(newProduct);

    // TODO: Sync with Medusa in production
    // For now, we just store in memory
    
    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}

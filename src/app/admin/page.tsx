"use client";

import { useEffect, useState } from "react";
import {
  Globe, Loader2, Check, AlertCircle, ShoppingBag,
  Trash2, LogOut, Package, Users, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useProductStore } from "@/stores/productStore";
import { useAuthStore } from "@/stores/authStore";
import { useConfigStore, AdminTab } from "@/stores/configStore";
import { useAffiliateStore } from "@/stores/affiliateStore";
import type { ScrapedProductData } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const { isAuthenticated, user, login, logout } = useAuthStore();
  const { activeTab, setActiveTab } = useConfigStore();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const tabs: { id: AdminTab; icon: typeof Package; label: string }[] = [
    { id: "manage", icon: Package, label: "Productos" },
    { id: "import", icon: Globe, label: "Importar" },
    { id: "affiliate", icon: Users, label: "Mi Perfil Afiliado" },
  ];

  // Scraper State
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedProductData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [creating, setCreating] = useState(false);
  const [includeTax, setIncludeTax] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Manual Product State
  const [manualProduct, setManualProduct] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    vendor: "Inspire",
    externalUrl: "",
  });

  // Store actions/state
  const { products, addProduct, updateProduct, deleteProduct, fetchProducts: fetchAllProducts } = useProductStore();
  const affiliate = useAffiliateStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllProducts();
      affiliate.fetchConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setLoginError("");
    } else {
      setLoginError("Contraseña incorrecta");
    }
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setScrapedData(null);
    setActiveImageIdx(0);
    setSuccess(false);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          taxRate: includeTax ? 1.18 : 1.0,
          refCode: affiliate.refCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al scrapear la URL");
      }

      if (data.images) {
        data.images = data.images.map((img: string) =>
          img.startsWith("//") ? `https:${img}` : img
        );
      }
      setScrapedData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManualProduct = async () => {
    if (!manualProduct.title || !manualProduct.price || !manualProduct.image) {
      setError("Completá los campos obligatorios (Nombre, Precio e Imagen)");
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const priceCents = Math.round(parseFloat(manualProduct.price) * 100);
      const newProduct = {
        id: `prod_man_${Date.now()}`,
        title: manualProduct.title,
        handle: manualProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: manualProduct.description,
        descriptionHtml: manualProduct.description,
        vendor: manualProduct.vendor,
        productType: "Inspire",
        tags: ["destacado"],
        status: "published" as const,
        images: [{ id: "img_0", url: manualProduct.image }],
        thumbnail: manualProduct.image,
        variants: [{
          id: `var_${Date.now()}`,
          title: "Default",
          price: priceCents,
          inventoryQuantity: 999,
          options: {},
        }],
        options: [{ id: `opt_${Date.now()}`, name: "Variante", values: ["Default"] }],
        priceRange: { minPrice: priceCents, maxPrice: priceCents },
        externalUrl: manualProduct.externalUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addProduct(newProduct);
      setSuccess(true);
      setManualProduct({ title: "", price: "", description: "", image: "", vendor: "Inspire", externalUrl: "" });
      setTimeout(() => setSuccess(false), 3000);
      setActiveTab("manage");
    } catch {
      setError("Error al crear producto manual");
    } finally {
      setCreating(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!scrapedData) return;

    setCreating(true);
    setError(null);

    try {
      const newProduct = {
        id: `prod_${Date.now()}`,
        title: scrapedData.title,
        handle: scrapedData.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        description: scrapedData.description,
        descriptionHtml: scrapedData.description,
        vendor: scrapedData.vendor || "Inspire",
        productType: "Inspire",
        tags: scrapedData.badges || [],
        status: "published" as const,
        images: scrapedData.images.map((imgUrl, i) => ({ id: `img_${i}`, url: imgUrl })),
        thumbnail: scrapedData.images[0] || "",
        variants: scrapedData.variants?.length
          ? scrapedData.variants.map((v, i) => ({
              id: v.id || `var_${Date.now()}_${i}`,
              title: v.title,
              price: v.price || 0,
              compareAtPrice: v.compareAtPrice,
              inventoryQuantity: v.available ? 100 : 0,
              options: { default: v.title },
            }))
          : [{
              id: `var_${Date.now()}`,
              title: "Default",
              price: scrapedData.price || 0,
              compareAtPrice: scrapedData.compareAtPrice,
              inventoryQuantity: 10,
              options: {},
            }],
        options: [{
          id: `opt_${Date.now()}`,
          name: "Variante",
          values: scrapedData.variants?.length
            ? scrapedData.variants.map(v => v.title)
            : ["Default"],
        }],
        priceRange: {
          minPrice: scrapedData.price || 0,
          maxPrice: scrapedData.price || 0,
        },
        compareAtPrice: scrapedData.compareAtPrice,
        features: scrapedData.features || [],
        shippingInfo: scrapedData.shippingInfo || [],
        badges: scrapedData.badges || [],
        externalUrl: scrapedData.url,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addProduct(newProduct);
      setSuccess(true);
      setScrapedData(null);
      setActiveImageIdx(0);
      setUrl("");

      setTimeout(() => setSuccess(false), 3000);
      setActiveTab("manage");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el producto");
    } finally {
      setCreating(false);
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return "No disponible";
    return `$${(price / 100).toFixed(2)}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Acceso Admin</h2>
            <p className="text-slate-500 mt-2">Ingresá tu contraseña para continuar</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
              {loginError && <p className="text-red-500 text-sm mt-2">{loginError}</p>}
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3">
              Ingresar al Panel
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Admin */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Panel de Afiliado</h1>
            <p className="text-slate-500 font-medium">Administrá tu catálogo y tu perfil de afiliado Inspire.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sesión Actual</span>
              <span className="text-sm font-black text-emerald-600 uppercase tracking-tighter">{user?.role}</span>
            </div>
            <Button variant="outline" onClick={logout} className="text-slate-600 border-2 border-slate-200 hover:bg-slate-100 md:w-auto w-full flex items-center justify-center font-bold">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-200 p-1 rounded-2xl mb-8 w-fit transition-all">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === tab.id ? "bg-white text-emerald-700 shadow-xl" : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/50"
              )}
            >
              <div className="flex items-center gap-2">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </div>
            </button>
          ))}
        </div>

        {/* Tab: Gestionar Productos */}
        {activeTab === "manage" && (
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-emerald-600" />
                Catálogo Afiliado
              </h2>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {products.length} productos
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <th className="p-6 w-16">Vista</th>
                    <th className="p-6">Nombre del Producto</th>
                    <th className="p-6">Variantes</th>
                    <th className="p-6">Precio Retail</th>
                    <th className="p-6">Link Afiliado</th>
                    <th className="p-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-20 text-center">
                        <div className="text-slate-300 font-bold uppercase tracking-widest mb-4">No hay productos aún</div>
                        <Button onClick={() => setActiveTab("import")} className="bg-emerald-600">Importar Primero</Button>
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-6">
                          <div className="w-14 h-14 bg-white rounded-2xl overflow-hidden relative border-2 border-slate-100 shadow-sm transition-transform group-hover:scale-110">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="p-6">
                          <p className="font-black text-slate-900 text-sm">{p.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{p.vendor}</p>
                        </td>
                        <td className="p-6">
                          <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                            {p.variants.length} opciones
                          </span>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-1 font-black text-emerald-600">
                            $ <input
                              type="number"
                              step="0.01"
                              className="w-20 bg-transparent focus:outline-none border-b-2 border-transparent focus:border-emerald-500 transition-colors"
                              defaultValue={(p.variants[0].price / 100).toFixed(2)}
                              onBlur={(e) => {
                                const newAmount = Math.round(parseFloat(e.target.value) * 100);
                                if (!isNaN(newAmount) && newAmount !== p.variants[0].price) {
                                  const updatedVariants = [...p.variants];
                                  updatedVariants[0].price = newAmount;
                                  updateProduct(p.id, {
                                    variants: updatedVariants,
                                    priceRange: { minPrice: newAmount, maxPrice: newAmount },
                                  });
                                }
                              }}
                            />
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Sin link asignado"
                              className={cn(
                                "flex-1 text-[10px] bg-slate-50 border-2 p-3 rounded-xl focus:outline-none focus:border-blue-500 font-bold",
                                !p.externalUrl ? "border-amber-200" : "border-slate-100"
                              )}
                              defaultValue={p.externalUrl || ""}
                              onBlur={(e) => {
                                updateProduct(p.id, { externalUrl: e.target.value });
                              }}
                            />
                            {p.externalUrl && (
                              <a
                                href={p.externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                title="Abrir link"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="p-6 text-right space-x-2">
                          <button
                            onClick={() => window.confirm("¿Seguro querés borrarlo?") && deleteProduct(p.id)}
                            className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Importar Productos */}
        {activeTab === "import" && (
          <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            {success && (
              <div className="p-6 bg-emerald-600 text-white rounded-3xl flex items-center gap-4 shadow-xl shadow-emerald-600/20 animate-bounce">
                <Check className="w-6 h-6" />
                <span className="font-black uppercase tracking-widest text-xs">¡Producto guardado exitosamente!</span>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-10">
              <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tighter flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-500" />
                Importar Producto
              </h2>

              <div className="p-4 mb-6 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-blue-900">
                <strong>Tip:</strong> Si pegás la URL sin <code className="bg-white px-2 py-0.5 rounded">sca_ref</code>, el sistema agregará
                automáticamente tu código de referido: <code className="bg-white px-2 py-0.5 rounded">{affiliate.refCode}</code>
              </div>

              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setScrapedData(null)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    !scrapedData ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
                  )}
                >
                  Importar URL
                </button>
                <button
                  onClick={() => setScrapedData({ title: "MANUAL", description: "", images: [], vendor: "", url: "", features: [], shippingInfo: [], badges: [] } as ScrapedProductData)}
                  className={cn(
                    "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                    scrapedData?.title === "MANUAL" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
                  )}
                >
                  Carga Manual
                </button>
              </div>

              {scrapedData?.title === "MANUAL" ? (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nombre del Producto</label>
                      <Input
                        placeholder="Ej: Kit Longevidad"
                        value={manualProduct.title}
                        onChange={(e) => setManualProduct({ ...manualProduct, title: e.target.value })}
                        className="py-6 rounded-2xl border-2"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Precio (en USD)</label>
                      <Input
                        type="number"
                        placeholder="Ej: 25.00"
                        value={manualProduct.price}
                        onChange={(e) => setManualProduct({ ...manualProduct, price: e.target.value })}
                        className="py-6 rounded-2xl border-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">URL de la Imagen</label>
                    <Input
                      placeholder="Pegá el link de la foto"
                      value={manualProduct.image}
                      onChange={(e) => setManualProduct({ ...manualProduct, image: e.target.value })}
                      className="py-6 rounded-2xl border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Link Afiliado (externalUrl)</label>
                    <Input
                      placeholder="https://rd.inspiretienda.com/products/..."
                      value={manualProduct.externalUrl}
                      onChange={(e) => setManualProduct({ ...manualProduct, externalUrl: e.target.value })}
                      className="py-6 rounded-2xl border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Descripción Corta</label>
                    <textarea
                      className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none min-h-[100px]"
                      placeholder="Contanos de qué se trata el producto..."
                      value={manualProduct.description}
                      onChange={(e) => setManualProduct({ ...manualProduct, description: e.target.value })}
                    />
                  </div>
                  <Button
                    onClick={handleCreateManualProduct}
                    disabled={creating}
                    className="w-full bg-emerald-600 py-6 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-emerald-500/20"
                  >
                    {creating ? "GUARDANDO..." : "PUBLICAR PRODUCTO"}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleScrape} className="flex flex-col gap-4 mb-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        type="url"
                        placeholder="Pegá la URL del producto Inspire"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        className="py-6 rounded-2xl border-2 focus:border-emerald-500 font-medium"
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="bg-slate-900 hover:bg-slate-800 text-white py-6 px-10 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl h-auto">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "INICIAR SCRAPING"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 px-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => setIncludeTax(!includeTax)}
                        className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${
                          includeTax ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${
                          includeTax ? "translate-x-4" : "translate-x-0"
                        }`} />
                      </div>
                      <span className="text-xs font-black text-slate-500 uppercase tracking-tighter">
                        Incluir ITBIS (18%) de República Dominicana
                      </span>
                    </label>
                  </div>
                </form>
              )}

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {scrapedData && scrapedData.title !== "MANUAL" && (
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-10 p-10">
                  <div className="space-y-4">
                    <div className="relative aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={scrapedData.images[activeImageIdx]} alt={scrapedData.title} className="object-cover w-full h-full" />
                    </div>
                    {scrapedData.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {scrapedData.images.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImageIdx(i)}
                            className={cn(
                              "relative w-16 h-16 flex-shrink-0 bg-white rounded-2xl overflow-hidden border-4 transition-all",
                              activeImageIdx === i ? "border-emerald-500" : "border-transparent opacity-50"
                            )}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt="" className="object-cover w-full h-full" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="mb-8">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] mb-2">Producto Encontrado</p>
                      <h3 className="text-4xl font-black text-slate-900 leading-tight mb-4">{scrapedData.title}</h3>
                      <p className="text-3xl font-black text-slate-900">{formatPrice(scrapedData.price)}</p>
                      {scrapedData.url && (
                        <p className="text-xs text-slate-400 mt-3 break-all">
                          <strong>Link:</strong> {scrapedData.url}
                        </p>
                      )}
                    </div>

                    <p className="text-slate-500 text-sm leading-relaxed mb-8 italic">
                      {scrapedData.description || "Sin descripción disponible."}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <Button onClick={handleCreateProduct} disabled={creating} className="bg-emerald-600 py-6 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-emerald-500/20">
                        {creating ? "PROCESANDO..." : "AGREGAR A CATÁLOGO"}
                      </Button>
                      <Button variant="outline" onClick={() => setScrapedData(null)} className="py-6 font-black uppercase tracking-widest text-xs rounded-2xl border-2 border-slate-200">
                        DESCARTAR
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Mi Perfil Afiliado */}
        {activeTab === "affiliate" && (
          <AffiliateProfileTab />
        )}
      </div>
    </div>
  );
}

function AffiliateProfileTab() {
  const { sponsorUrl, refCode, affiliateName, whatsappNumber, officeUrl, tagline, updateConfig, error } = useAffiliateStore();

  const [form, setForm] = useState({
    sponsorUrl,
    refCode,
    affiliateName,
    whatsappNumber,
    officeUrl,
    tagline,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setForm({ sponsorUrl, refCode, affiliateName, whatsappNumber, officeUrl, tagline });
  }, [sponsorUrl, refCode, affiliateName, whatsappNumber, officeUrl, tagline]);

  const handleSave = async () => {
    setSaving(true);
    setLocalError(null);
    try {
      await updateConfig(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-10 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
          <Users className="w-8 h-8 text-emerald-600" />
          Mi Perfil Afiliado
        </h2>
        <p className="text-slate-500 mt-2 font-medium">Configurá tus links únicos de Inspire. Todo el sitio se actualiza automáticamente.</p>
      </div>

      <div className="p-10 space-y-8">
        {saved && (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700 font-bold text-sm">
            <Check className="w-5 h-5" />
            <span>Guardado correctamente. Los cambios ya están activos en el sitio.</span>
          </div>
        )}

        {(localError || error) && (
          <div className="p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
            <AlertCircle className="w-5 h-5" />
            <span>{localError || error}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Tu nombre público</label>
            <Input
              value={form.affiliateName}
              onChange={(e) => setForm({ ...form, affiliateName: e.target.value })}
              placeholder="Ej: Cristopher"
              className="py-6 rounded-2xl border-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">WhatsApp (con código país)</label>
            <Input
              value={form.whatsappNumber}
              onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
              placeholder="+18095550123"
              className="py-6 rounded-2xl border-2"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Frase / Tagline</label>
          <Input
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            placeholder="Ej: Tu socio en el camino al bienestar"
            className="py-6 rounded-2xl border-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
            Link de Registro (Sponsor) <span className="text-red-500">*</span>
          </label>
          <Input
            value={form.sponsorUrl}
            onChange={(e) => setForm({ ...form, sponsorUrl: e.target.value })}
            placeholder="https://www.oficina.rd.inspiretienda.com/register?ref=..."
            className="py-6 rounded-2xl border-2 font-mono text-xs"
          />
          <p className="text-xs text-slate-400 ml-2">Link que usarán las personas para registrarse como afiliados debajo tuyo.</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
            Código de Referido (sca_ref) <span className="text-red-500">*</span>
          </label>
          <Input
            value={form.refCode}
            onChange={(e) => setForm({ ...form, refCode: e.target.value })}
            placeholder="11048224.XXXXXXXXXXXX"
            className="py-6 rounded-2xl border-2 font-mono text-xs"
          />
          <p className="text-xs text-slate-400 ml-2">Se inyecta automáticamente en links de productos que no lo tengan.</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Link a tu Oficina Virtual (opcional)</label>
          <Input
            value={form.officeUrl}
            onChange={(e) => setForm({ ...form, officeUrl: e.target.value })}
            placeholder="https://www.oficina.rd.inspiretienda.com/..."
            className="py-6 rounded-2xl border-2 font-mono text-xs"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-emerald-600 hover:bg-emerald-700 py-6 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-emerald-500/20"
        >
          {saving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
        </Button>
      </div>
    </div>
  );
}

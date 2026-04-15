"use client";

import { useEffect, useState } from "react";
import { 
  Link, Globe, Loader2, Plus, Check, AlertCircle, ShoppingBag, 
  Edit, Trash2, LogOut, Package, ClipboardList, Eye, Printer, X, Truck, User,
  ShieldCheck, Settings
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useProductStore } from "@/stores/productStore";
import { useAuthStore } from "@/stores/authStore";
import { useOrderStore, Order } from "@/stores/orderStore";
import { useConfigStore, AdminTab } from "@/stores/configStore";
import type { ScrapedProductData } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const { isAuthenticated, user, login, logout } = useAuthStore();
  const { permissions, updatePermissions } = useConfigStore();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<AdminTab>("manage");

  // Determine available tabs for current user role
  const allTabs: { id: AdminTab; icon: any; label: string }[] = [
    { id: "manage", icon: Package, label: "Productos" },
    { id: "import", icon: Globe, label: "Importar" },
    { id: "orders", icon: ClipboardList, label: "Órdenes" },
    { id: "permissions", icon: ShieldCheck, label: "Permisos" }
  ];

  const rolePermissions = user ? permissions[user.role] : [];
  const visibleTabs = allTabs.filter(tab => rolePermissions.includes(tab.id));

  // Ensure active tab is valid for current user
  useEffect(() => {
    if (isAuthenticated && visibleTabs.length > 0) {
      if (!visibleTabs.find(t => t.id === activeTab)) {
        setActiveTab(visibleTabs[0].id);
      }
    }
  }, [isAuthenticated, visibleTabs, activeTab]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Scraper State
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedProductData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [creating, setCreating] = useState(false);
  const [includeTax, setIncludeTax] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Store actions/state
  const { products, addProduct, updateProduct, deleteProduct, fetchProducts: fetchAllProducts } = useProductStore();
  const { orders, clearOrders, fetchOrders } = useOrderStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchAllProducts();
    }
  }, [isAuthenticated, fetchOrders, fetchAllProducts]);

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
          taxRate: includeTax ? 1.18 : 1.0 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al scrapear la URL");
      }

      if (data.images) {
        data.images = data.images.map((img: string) =>
          img.startsWith('//') ? `https:${img}` : img
        );
      }
      setScrapedData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
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
        vendor: scrapedData.vendor || "Naturista",
        productType: "General",
        tags: scrapedData.badges || [],
        status: "published" as const,
        images: scrapedData.images.map((url, i) => ({ id: `img_${i}`, url })),
        thumbnail: scrapedData.images[0] || "",
        variants: scrapedData.variants?.length ? scrapedData.variants.map((v, i) => ({
          id: v.id || `var_${Date.now()}_${i}`,
          title: v.title,
          price: v.price || 0,
          compareAtPrice: v.compareAtPrice,
          inventoryQuantity: v.available ? 100 : 0,
          options: { default: v.title },
        })) : [{
          id: `var_${Date.now()}`,
          title: "Default",
          price: scrapedData.price || 0,
          compareAtPrice: scrapedData.compareAtPrice,
          inventoryQuantity: 10,
          options: {},
        }],
        options: [{ id: `opt_${Date.now()}`, name: "Variante", values: scrapedData.variants?.length ? scrapedData.variants.map(v => v.title) : ["Default"] }],
        priceRange: {
          minPrice: scrapedData.price || 0,
          maxPrice: scrapedData.price || 0,
        },
        compareAtPrice: scrapedData.compareAtPrice,
        features: scrapedData.features || [],
        shippingInfo: scrapedData.shippingInfo || [],
        badges: scrapedData.badges || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addProduct(newProduct);
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

  const handlePrint = () => {
    window.print();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Acceso Admin</h2>
            <p className="text-slate-500 mt-2">Ingresa tu contraseña para continuar</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Input
                type="password"
                placeholder="Contraseña (Admin, staff123 o viewer123)"
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
      {/* Printable Area (Hidden in browser, visible in print) */}
      {selectedOrder && (
        <div className="hidden print:block fixed inset-0 bg-white p-10 z-[100]">
          <div className="flex justify-between items-start mb-10 border-b-2 border-slate-900 pb-8">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter">FACTURA DE VENTA</h1>
              <p className="text-slate-500 mt-1">Nº #{selectedOrder.id}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">Inspire Su Vida</h2>
              <p className="text-sm text-slate-500">Tienda Online de Productos Naturales</p>
              <p className="text-sm text-slate-500">Santiago, República Dominicana</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 mb-10 text-sm">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-black uppercase tracking-widest text-xs text-slate-400 mb-4">DATOS DEL CLIENTE</h3>
              <p className="font-bold text-lg text-slate-900">{selectedOrder.customer.name}</p>
              <p className="text-slate-600 mt-1">{selectedOrder.customer.email}</p>
              <p className="text-slate-600">{selectedOrder.customer.phone}</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
              <h3 className="font-black uppercase tracking-widest text-xs text-emerald-800/40 mb-4">DATOS DE ENVÍO</h3>
              <p className="font-bold text-slate-900 text-lg uppercase">{selectedOrder.customer.address}</p>
              <p className="text-emerald-800 font-medium mt-1">{selectedOrder.customer.city}</p>
              <p className="text-slate-500 mt-2 italic">Fecha: {new Date(selectedOrder.date).toLocaleDateString()}</p>
            </div>
          </div>

          <table className="w-full text-left mb-10">
            <thead>
              <tr className="border-b-2 border-slate-900 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="py-4">Producto</th>
                <th className="py-4">Cantidad</th>
                <th className="py-4 text-right">Precio</th>
                <th className="py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 italic">
              {selectedOrder.items.map((item, i) => (
                <tr key={i}>
                  <td className="py-4 font-bold text-slate-900">{item.title}</td>
                  <td className="py-4">{item.quantity}</td>
                  <td className="py-4 text-right">{formatPrice(item.price)}</td>
                  <td className="py-4 text-right font-black">{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900">
                <td colSpan={3} className="py-6 text-right font-black uppercase tracking-widest text-sm">TOTAL FINAL</td>
                <td className="py-6 text-right font-black text-2xl text-emerald-600">{formatPrice(selectedOrder.total)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div className="text-center mt-20 border-t border-slate-100 pt-8 opacity-50">
            <p className="text-xs uppercase tracking-[0.5em] font-bold">¡Gracias por tu compra!</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 print:hidden">
        {/* Header Admin */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Panel de Gestión</h1>
            <p className="text-slate-500 font-medium">Administra tu inventario y gestiona tus despachos.</p>
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
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

        {/* Tab 1: Gestionar Productos */}
        {activeTab === "manage" && (
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-emerald-600" />
                Inventario General
              </h2>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {products.length} productos registrados
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
                    <th className="p-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.length === 0 ? (
                     <tr>
                       <td colSpan={5} className="p-20 text-center">
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
                            {p.variants.length} OPCCIONES
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
                                    priceRange: { minPrice: newAmount, maxPrice: newAmount } 
                                  });
                                }
                              }}
                            />
                          </div>
                        </td>
                        <td className="p-6 text-right space-x-2">
                          <button
                            onClick={() => window.confirm("¿Seguro quieres borrarlo?") && deleteProduct(p.id)}
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

        {/* Tab 2: Importar Productos */}
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
                Extraer del Proveedor
              </h2>
              
              <form onSubmit={handleScrape} className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="url"
                      placeholder="Pega la URL del producto (Shopify, etc)"
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
                        includeTax ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${
                        includeTax ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </div>
                    <span className="text-xs font-black text-slate-500 uppercase tracking-tighter">
                      Incluir ITBIS (18%) de República Dominicana
                    </span>
                  </label>
                </div>
              </form>
              
              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {scrapedData && (
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
                    </div>
                    
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 italic">
                      {scrapedData.description || "Sin descripción disponible."}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <Button onClick={handleCreateProduct} disabled={creating} className="bg-emerald-600 py-6 font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-emerald-500/20">
                        {creating ? "PROCESANDO..." : "AGREGAR A TIENDA"}
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

        {/* Tab 3: Órdenes */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                <ClipboardList className="w-6 h-6 text-emerald-600" />
                Control de Despachos
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => confirm("Limpiar?") && clearOrders()}
                className="text-red-500 border-2 border-red-100 hover:bg-red-50 font-black text-[10px] uppercase tracking-widest py-2"
              >
                LIMPIAR TODO
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <th className="p-6">ID ORDEN</th>
                    <th className="p-6">FECHA</th>
                    <th className="p-6">CLIENTE</th>
                    <th className="p-6">ITEMS</th>
                    <th className="p-6">TOTAL</th>
                    <th className="p-6">ESTADO</th>
                    <th className="p-6 text-right">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.length === 0 ? (
                    <tr><td colSpan={7} className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">Esperando primeras ventas...</td></tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-6">
                          <span className="font-black text-xs text-slate-400">#{order.id.split('-')[1]}</span>
                        </td>
                        <td className="p-6 text-[10px] font-black text-slate-500 uppercase">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 font-black text-xs">
                              {order.customer.name[0]}
                            </div>
                            <div>
                               <p className="font-black text-slate-900 text-xs">{order.customer.name}</p>
                               <p className="text-[10px] text-slate-400">{order.customer.city}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-[10px] font-black text-emerald-600 uppercase">
                          {order.items.length} PRODUCTOS
                        </td>
                        <td className="p-6">
                          <span className="font-black text-slate-900">{formatPrice(order.total)}</span>
                        </td>
                        <td className="p-6">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                            order.status === "paid" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"
                          )}>
                            {order.status === "paid" ? "Pagado" : "Pendiente"}
                          </span>
                        </td>
                        <td className="p-6 text-right space-x-2">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="p-3 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all"
                            title="Ver Dirección"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => { setSelectedOrder(order); setTimeout(handlePrint, 100); }}
                            className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                            title="Imprimir Factura"
                          >
                            <Printer className="w-5 h-5" />
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

        {/* Tab 4: Permisos y Roles */}
        {activeTab === "permissions" && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-500">
            <div className="p-10 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
                Control de Acceso (RBAC)
              </h2>
              <p className="text-slate-500 mt-2 font-medium">Configura qué módulos puede ver cada rol de usuario.</p>
            </div>

            <div className="p-10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                      <th className="pb-6">Módulo / Tab</th>
                      <th className="pb-6 text-center">Admin</th>
                      <th className="pb-6 text-center">Staff</th>
                      <th className="pb-6 text-center">Viewer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[
                      { id: "manage", label: "Gestión de Productos" },
                      { id: "import", label: "Importación (Scraping)" },
                      { id: "orders", label: "Control de Órdenes" },
                      { id: "permissions", label: "Configuración de Permisos" }
                    ].map((module) => (
                      <tr key={module.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-6 pr-6">
                          <p className="font-black text-slate-900">{module.label}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Tab ID: {module.id}</p>
                        </td>
                        {["admin", "staff", "viewer"].map((role) => (
                          <td key={role} className="py-6 text-center">
                            <label className="relative inline-flex items-center cursor-pointer group/check">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={permissions[role as keyof typeof permissions]?.includes(module.id as any)}
                                disabled={role === "admin" && module.id === "permissions"} // Prevent lockout
                                onChange={(e) => {
                                  const currentRoles = permissions[role as keyof typeof permissions] || [];
                                  let newRoles: AdminTab[];
                                  if (e.target.checked) {
                                    newRoles = [...currentRoles, module.id as AdminTab];
                                  } else {
                                    newRoles = currentRoles.filter(id => id !== module.id);
                                  }
                                  updatePermissions(role as keyof typeof permissions, newRoles);
                                }}
                              />
                              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-12 p-8 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 flex-shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-amber-900 uppercase tracking-tighter text-sm">Nota de Seguridad</h4>
                  <p className="text-amber-800/70 text-sm mt-1 leading-relaxed">
                    Los cambios aplicados aquí son inmediatos y persistentes para todos los usuarios logueados con el rol correspondiente. 
                    Asegúrate de no quitarle el acceso a "Permisos" al rol **Admin** para evitar bloqueos accidentales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Details Modal Overlay */}
      {selectedOrder && !window.matchMedia('print').matches && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white max-w-2xl w-full rounded-[2.5rem] shadow-2xl overflow-hidden border border-white animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                       <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Detalles de la Orden</h3>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">#{selectedOrder.id}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400">
                    <X className="w-6 h-6" />
                 </button>
              </div>

              <div className="p-8 space-y-8">
                 {/* Customer Data Grid */}
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <div className="flex items-center gap-2 text-slate-400 mb-4">
                          <User className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Información Personal</span>
                       </div>
                       <p className="font-black text-slate-900 text-lg">{selectedOrder.customer.name}</p>
                       <p className="text-sm font-medium text-slate-500 mt-1">{selectedOrder.customer.email}</p>
                       <p className="text-sm font-black text-emerald-600 mt-2">{selectedOrder.customer.phone}</p>
                    </div>

                    <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                       <div className="flex items-center gap-2 text-emerald-800/40 mb-4">
                          <Truck className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Destino de Envío</span>
                       </div>
                       <p className="font-black text-slate-900 uppercase leading-snug">{selectedOrder.customer.address}</p>
                       <p className="text-sm font-bold text-emerald-700 mt-2">{selectedOrder.customer.city}</p>
                    </div>
                 </div>

                 {/* Items List */}
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Productos a Despachar</h4>
                    <div className="space-y-2">
                       {selectedOrder.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 bg-white border-2 border-slate-50 rounded-2xl">
                             <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden flex-shrink-0">
                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="font-black text-slate-900 text-sm truncate">{item.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 italic">Cantidad: {item.quantity}</p>
                             </div>
                             <div className="text-right">
                                <p className="font-black text-slate-900">{formatPrice(item.price * item.quantity)}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Transacción</p>
                       <p className="text-3xl font-black text-emerald-600">{formatPrice(selectedOrder.total)}</p>
                    </div>
                    <Button onClick={handlePrint} className="bg-slate-900 px-8 py-6 rounded-2xl flex items-center gap-2">
                       <Printer className="w-5 h-5" />
                       IMPRIMIR PARA DESPACHO
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print\:block, .print\:block * { visibility: visible; }
          .print\:block { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}

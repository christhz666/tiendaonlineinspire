"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ShieldCheck, Truck, ShoppingBag, Info, Lock } from "lucide-react";
import { useCartStore, useCartItems, useCartTotal } from "@/stores/cartStore";
import { useCurrencyStore } from "@/stores/currencyStore";
import { useOrderStore } from "@/stores/orderStore";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const PayPalCheckout = dynamic(
  () => import("@/components/ui/PayPalCheckout").then((m) => m.PayPalCheckout),
  { ssr: false, loading: () => <div className="h-12 animate-pulse bg-slate-100 rounded-xl" /> }
);

export default function CheckoutPage() {
  const items = useCartItems();
  const { subtotal, tax, shipping, total } = useCartTotal();
  const { clearCart } = useCartStore();
  const addOrder = useOrderStore((state) => state.addOrder);
  const format = useCurrencyStore((state) => state.format);

  const [shippingData, setShippingData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    phone: "",
    zip: "",
    country: "República Dominicana"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formValid, setFormValid] = useState(false);

  // Validate form on change
  useEffect(() => {
    const isValid = !!(
      shippingData.name && 
      shippingData.email && 
      /^\S+@\S+\.\S+$/.test(shippingData.email) &&
      shippingData.address && 
      shippingData.city && 
      shippingData.phone
    );
    setFormValid(isValid);
  }, [shippingData]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <ShoppingCartIcon className="w-16 h-16 text-slate-200 mb-4" />
        <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase italic tracking-tighter">Tu carrito está vacío</h1>
        <p className="text-slate-500 mb-8 font-medium">No hay productos para procesar el pago.</p>
        <Link 
          href="/"
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="lg:hidden p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-[100]">
        <Link href="/" className="font-black text-xl italic tracking-tighter text-slate-900 flex items-center gap-1">
          <span className="text-emerald-500 text-2xl">I</span>NSPIRE
        </Link>
        <div className="flex items-center gap-2 text-slate-500 font-bold">
          <ShoppingBag className="w-5 h-5" />
          <span>{format(total)}</span>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto grid lg:grid-cols-[1fr_420px] min-h-screen">
        
        {/* Left Column: Comprehensive Checkout */}
        <div className="p-6 md:p-10 lg:p-16 space-y-12">
          {/* Breadcrumbs (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <Link href="/" className="text-emerald-600 hover:text-emerald-700">Tienda</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900">Finalizar Compra</span>
          </div>

          <div className="space-y-12">
            {/* Section 1: Contact & Delivery */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs italic">1</div>
                <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Información de Entrega</h2>
              </div>

              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                    <input 
                      type="email"
                      placeholder="tu@email.com"
                      value={shippingData.email}
                      onChange={(e) => setShippingData({...shippingData, email: e.target.value})}
                      className={cn("w-full px-4 py-4 bg-white border-2 rounded-2xl focus:outline-none transition-all font-medium", errors.email ? "border-red-200" : "border-slate-100 focus:border-emerald-500")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Teléfono</label>
                    <input 
                      type="tel"
                      placeholder="809-XXX-XXXX"
                      value={shippingData.phone}
                      onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                      className={cn("w-full px-4 py-4 bg-white border-2 rounded-2xl focus:outline-none transition-all font-medium", errors.phone ? "border-red-200" : "border-slate-100 focus:border-emerald-500")}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre Completo</label>
                  <input 
                    type="text"
                    placeholder="Juan Pérez"
                    value={shippingData.name}
                    onChange={(e) => setShippingData({...shippingData, name: e.target.value})}
                    className={cn("w-full px-4 py-4 bg-white border-2 rounded-2xl focus:outline-none transition-all font-medium", errors.name ? "border-red-200" : "border-slate-100 focus:border-emerald-500")}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Dirección Exacta</label>
                  <input 
                    type="text"
                    placeholder="Calle #, Edificio, Apartamento..."
                    value={shippingData.address}
                    onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                    className={cn("w-full px-4 py-4 bg-white border-2 rounded-2xl focus:outline-none transition-all font-medium", errors.address ? "border-red-200" : "border-slate-100 focus:border-emerald-500")}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ciudad / Provincia</label>
                    <input 
                      type="text"
                      placeholder="Santo Domingo"
                      value={shippingData.city}
                      onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                      className={cn("w-full px-4 py-4 bg-white border-2 rounded-2xl focus:outline-none transition-all font-medium", errors.city ? "border-red-200" : "border-slate-100 focus:border-emerald-500")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">País</label>
                    <input 
                      type="text"
                      value="República Dominicana"
                      disabled
                      className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Payment */}
            <section className="space-y-8 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs italic">2</div>
                <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Método de Pago Seguro</h2>
              </div>

              {!formValid ? (
                <div className="p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center space-y-3">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <Lock className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Completa tus datos de entrega<br />para habilitar el pago
                  </p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="bg-white border-2 border-emerald-500 rounded-3xl overflow-hidden shadow-xl shadow-emerald-500/5">
                    <div className="p-6 bg-emerald-50/50 flex items-center justify-between border-b border-emerald-100">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <span className="font-black text-slate-900 uppercase italic tracking-tighter text-sm">Pago Garantizado</span>
                      </div>
                      <Image src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" width={70} height={20} />
                    </div>
                    
                    <div className="p-8">
                      <div className="max-w-sm mx-auto relative z-10">
                        <PayPalCheckout
                          key={`paypal-${total}`}
                          totalUSD={(total / 100).toFixed(2)}
                          onSuccess={() => {
                            addOrder({
                              items: items.map(item => ({...item})),
                              total: total,
                              customer: { ...shippingData },
                              status: "paid"
                            });
                            
                            clearCart();
                            window.location.href = "/checkout/success";
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-6">
                        Paga con tu cuenta de PayPal o con Tarjeta de Crédito/Débito
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-slate-300">
                    <div className="h-px flex-1 bg-slate-100" />
                    <Info className="w-4 h-4" />
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>
                </div>
              )}
            </section>
          </div>

          <footer className="pt-10 border-t border-slate-100 text-[10px] font-bold text-slate-300 uppercase tracking-widest flex flex-wrap gap-6 justify-center lg:justify-start">
            <Link href="/privacy" className="hover:text-slate-500 transition-colors">Privacidad</Link>
            <Link href="/refund" className="hover:text-slate-500 transition-colors">Reembolsos</Link>
            <Link href="/terms" className="hover:text-slate-500 transition-colors">Términos Legales</Link>
          </footer>
        </div>

        {/* Right Column: Order Summary (Fidex on Desktop) */}
        <aside className="bg-slate-50/50 p-6 md:p-10 lg:p-12 lg:border-l border-slate-100 overflow-y-auto">
          <div className="sticky top-24 lg:top-12 space-y-10">
            <h2 className="text-sm font-black text-slate-900 uppercase italic tracking-widest border-b border-slate-200 pb-4">Resumen de tu Pedido</h2>
            
            {/* Items List */}
            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center group">
                  <div className="relative w-20 h-20 bg-white rounded-2xl border border-slate-200 overflow-hidden flex-shrink-0 shadow-sm transition-transform group-hover:scale-105">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                    <span className="absolute -top-2 -right-2 bg-slate-900 text-white w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black z-10 shadow-lg border-2 border-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 text-xs uppercase tracking-tight truncate">{item.title}</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.variantTitle}</p>
                    <p className="font-black text-slate-900 text-sm italic tracking-tighter mt-2">{format(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="pt-8 border-t border-slate-200 space-y-4">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-slate-900">{format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-slate-400">ITBIS (18%)</span>
                <span className="text-slate-900">{format(tax)}</span>
              </div>
              <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Envío</span>
                </div>
                <span className="text-[10px] font-black text-emerald-700 uppercase italic tracking-tighter">Gratis</span>
              </div>
            </div>

            {/* Total */}
            <div className="pt-8 border-t-2 border-slate-900 flex justify-between items-center">
              <div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Pago Total</span>
                <span className="text-[10px] font-bold text-slate-300 uppercase">RD$</span>
              </div>
              <span className="text-4xl font-black text-slate-900 tracking-tighter italic">{format(total)}</span>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4">
               <div className="p-3 bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center gap-1 shadow-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="text-[8px] font-black uppercase text-slate-400">Pago Seguro</span>
               </div>
               <div className="p-3 bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center gap-1 shadow-sm">
                  <Truck className="w-5 h-5 text-slate-400" />
                  <span className="text-[8px] font-black uppercase text-slate-400">Envío Rápido</span>
               </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ShoppingCartIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  );
}

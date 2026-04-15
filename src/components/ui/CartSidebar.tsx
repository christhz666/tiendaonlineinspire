"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, Trash2, ChevronRight, Truck } from "lucide-react";
import { useCartStore, useCartItems, useCartTotal } from "@/stores/cartStore";
import { useCurrencyStore } from "@/stores/currencyStore";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function CartSidebar() {
  const { isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const items = useCartItems();
  const { subtotal, tax, shipping, total } = useCartTotal();
  const format = useCurrencyStore((state) => state.format);
  const router = useRouter();
  
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 animate-in fade-in"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 p-2 rounded-xl">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Tu Carrito</h2>
          </div>
          <button 
            onClick={closeCart}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-10 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <ShoppingBag className="w-10 h-10 text-slate-200" />
              </div>
              <p className="text-slate-900 font-black text-xl mb-3 uppercase italic tracking-tighter pr-2">Tu carrito está vacío</p>
              <p className="text-slate-500 mb-10 font-medium max-w-[240px]">¡Explora nuestra colección y encuentra algo especial para ti!</p>
              <button 
                onClick={closeCart}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10 uppercase tracking-widest text-xs"
              >
                IR A LA TIENDA
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* CART LIST */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-5 p-4 bg-slate-50/50 rounded-3xl border border-slate-100 group transition-all hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                    <div className="relative w-20 h-24 flex-shrink-0 bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm transition-transform group-hover:scale-105">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-black text-slate-900 text-sm truncate uppercase tracking-tight">{item.title}</h3>
                          <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-1">{item.variantTitle}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 text-slate-600" />
                          </button>
                          <span className="w-5 text-center text-sm font-black text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 text-slate-600" />
                          </button>
                        </div>
                        <p className="font-black text-slate-900 text-base italic tracking-tighter">{format(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Banner */}
              <div className="p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl text-white shadow-xl shadow-emerald-500/20 flex gap-4 items-center">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Promoción Activa</p>
                  <p className="font-black text-sm italic tracking-tighter uppercase pr-2">Envío Gratis a todo el país</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-8 border-t border-slate-100 bg-white">
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                <span className="text-slate-900 font-black">{format(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">ITBIS (18%)</span>
                <span className="text-slate-900 font-black">{format(tax)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Envío</span>
                <span className="text-emerald-600 font-black italic tracking-tighter uppercase text-xs">¡Gratis!</span>
              </div>
              <div className="pt-5 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xl font-black text-slate-900 uppercase italic tracking-tighter pr-2">Total</span>
                <span className="text-3xl font-black text-slate-900 tracking-tighter">{format(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-6 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center gap-4 shadow-2xl shadow-slate-900/20 uppercase tracking-widest text-xs group"
            >
              PROCESAR COMPRA
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-[9px] text-center text-slate-300 font-bold uppercase tracking-widest mt-6">
              Paga seguro con PayPal y Tarjetas de Crédito
            </p>
          </div>
        )}
      </div>
    </>
  );
}

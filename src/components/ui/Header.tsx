"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, Leaf, ChevronDown, Bell, Search, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore, useCartTotal } from "@/stores/cartStore";
import { useCurrencyStore } from "@/stores/currencyStore";
import { useAuthStore } from "@/stores/authStore";
import { CURRENCY_MAP } from "@/lib/currency";
import type { CurrencyInfo } from "@/lib/currency";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const { toggleCart } = useCartStore();
  const { items } = useCartTotal();
  const { currency, setCurrency } = useCurrencyStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const uniqueCurrencies = Object.values(CURRENCY_MAP).filter(
    (c, idx, arr) => arr.findIndex((x) => x.code === c.code) === idx
  );

  const handleCurrencySelect = (c: CurrencyInfo) => {
    setCurrency(c);
    setCurrencyOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
      {/* Top Banner */}
      <div className={cn(
        "bg-emerald-600 text-white text-[10px] sm:text-xs py-1.5 transition-all duration-300 overflow-hidden",
        scrolled ? "h-0 py-0" : "h-auto"
      )}>
        <div className="max-w-7xl mx-auto px-4 text-center font-bold tracking-widest uppercase">
          🌿 Envío gratis a toda República Dominicana en pedidos mayores a $50
        </div>
      </div>

      <header className={cn(
        "transition-all duration-500 border-b",
        scrolled 
          ? "bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-lg py-2" 
          : "bg-white border-transparent py-4"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 shadow-lg shadow-emerald-500/20">
                <Leaf className="w-6 h-6 text-white" />
                <div className="absolute inset-0 bg-white/20 rounded-2xl scale-0 group-hover:scale-100 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 leading-none">
                  Inspire<span className="text-emerald-600 underline decoration-2 underline-offset-4 decoration-emerald-200">Su Vida</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Productos 100% Naturales</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
              <Link
                href="/"
                className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-emerald-700 hover:bg-white rounded-xl transition-all"
              >
                Inicio
              </Link>
              <Link
                href="/#products"
                className="px-5 py-2 text-sm font-bold text-slate-600 hover:text-emerald-700 hover:bg-white rounded-xl transition-all"
              >
                Productos
              </Link>
              <Link
                href="/admin"
                className={cn(
                  "px-5 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2",
                  isAuthenticated 
                    ? "bg-emerald-50 text-emerald-700" 
                    : "text-slate-600 hover:text-emerald-700 hover:bg-white"
                )}
              >
                {isAuthenticated && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                Portal Admin
              </Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Desktop Icons */}
              <div className="hidden sm:flex items-center gap-1 mr-2">
                <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1" />
              </div>

              {/* Currency Selector */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  className="flex items-center gap-1.5 h-11 px-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:border-emerald-300 transition-all shadow-sm active:scale-95"
                >
                  <span className="text-emerald-600">{currency.symbol}</span>
                  <span>{currency.code}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform", currencyOpen && "rotate-180")} />
                </button>

                {currencyOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setCurrencyOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Currency</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      </div>
                      <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                        {uniqueCurrencies.map((c) => (
                          <button
                            key={c.code}
                            onClick={() => handleCurrencySelect(c)}
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all",
                              currency.code === c.code
                                ? "bg-emerald-600 text-white font-bold"
                                : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                            )}
                          >
                            <span>{c.name}</span>
                            <span className={cn(
                              "font-black text-[10px]",
                              currency.code === c.code ? "text-emerald-100" : "text-slate-300"
                            )}>{c.symbol} {c.code}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Hidden Cart for Funnel Model */}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all active:scale-90"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={cn(
              "md:hidden overflow-hidden transition-all duration-500",
              mobileMenuOpen ? "max-h-[80vh] pt-6 pb-4" : "max-h-0"
            )}
          >
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl text-slate-900 font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                Inicio
                <Bell className="w-4 h-4 text-emerald-400" />
              </Link>
              <Link
                href="/#products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl text-slate-900 font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                Productos
                <Search className="w-4 h-4 text-emerald-400" />
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl text-white font-bold hover:bg-slate-800 transition-colors"
              >
                Portal Admin
                <User className="w-4 h-4 text-emerald-400" />
              </Link>

              {/* Mobile currency selector */}
              <div className="bg-white border border-slate-100 p-6 rounded-3xl mt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Seleccionar Moneda</p>
                <div className="grid grid-cols-2 gap-2">
                  {uniqueCurrencies.slice(0, 10).map((c) => (
                    <button
                      key={c.code}
                      onClick={() => { setCurrency(c); setMobileMenuOpen(false); }}
                      className={cn(
                        "flex flex-col items-start gap-1 p-3 rounded-2xl border-2 transition-all",
                        currency.code === c.code
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm"
                          : "border-slate-100 text-slate-600"
                      )}
                    >
                      <span className="text-[10px] font-black">{c.code}</span>
                      <span className="font-bold">{c.symbol} {c.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}

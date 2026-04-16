"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, Leaf, Heart, Shield, Truck, Star, 
  ChevronDown, ShoppingBag, Award, Zap, Rocket, Users, TrendingUp
} from "lucide-react";
import { useFeaturedProducts, useProductStore } from "@/stores/productStore";
import { useAffiliateStore } from "@/stores/affiliateStore";
import { ProductCard } from "@/components/ui/ProductCard";
import { cn } from "@/lib/utils";

export default function Home() {
  const featuredProducts = useFeaturedProducts();
  const fetchProducts = useProductStore(state => state.fetchProducts);
  const fetchAffiliate = useAffiliateStore(state => state.fetchConfig);
  const sponsorUrl = useAffiliateStore(state => state.sponsorUrl);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetchProducts();
    fetchAffiliate();
  }, [fetchProducts, fetchAffiliate]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-white">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] right-[5%] w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50 animate-pulse" />
          <div className="absolute bottom-[10%] left-[5%] w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-40 animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className={cn(
              "text-center lg:text-left transition-all duration-1000 transform",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/50 backdrop-blur-sm rounded-full text-emerald-700 font-bold text-xs mb-8 uppercase tracking-[0.2em] border border-emerald-200">
                <Leaf className="w-3.5 h-3.5" />
                Pure & Natural Selection
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-tight mb-8">
                Inspiramos tu <br />
                <span className="relative text-emerald-600">
                  Bienestar
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-200" />
                  </svg>
                </span>
                <br />diario
              </h1>
              
              <p className="text-lg sm:text-2xl text-slate-500 mb-10 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Descubre la pureza de la naturaleza con productos premium seleccionados para potenciar tu vitalidad y salud.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link 
                  href="#products" 
                  className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 active:scale-95 overflow-hidden"
                >
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 transition-transform translate-y-full group-hover:translate-y-0" />
                  <ShoppingBag className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                  EXPLORAR CATÁLOGO
                  <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link 
                  href="/oportunidad" 
                  className="flex items-center justify-center gap-3 px-10 py-5 bg-white border-2 border-emerald-200 text-emerald-700 font-black rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all active:scale-95"
                >
                  <Rocket className="w-5 h-5" />
                  SER EMPRESARIO
                </Link>
              </div>

              {/* Stats & Trust */}
              <div className="flex flex-wrap gap-8 mt-16 pt-10 border-t border-slate-100 justify-center lg:justify-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-emerald-600">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 leading-none">100%</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Orgánico</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-blue-600">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 leading-none">24-48h</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Envío Nacional</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 text-amber-500">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900 leading-none">5K+</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ventas Exitosas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image / Video Container */}
            <div className={cn(
              "relative transition-all duration-1000 delay-300 transform",
              isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
            )}>
              <div className="relative w-full aspect-[4/5] sm:aspect-square group lg:scale-110">
                {/* Frame Decor */}
                <div className="absolute inset-0 border-2 border-emerald-100 rounded-[3rem] -rotate-3 scale-105" />
                
                <div className="relative h-full bg-slate-100 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border-8 border-white">
                  <video
                    src="/hero-video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 object-center"
                    style={{ minHeight: '100%', minWidth: '100%' }}
                  />
                  {/* Overlay for better text read if any */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                </div>

                {/* Floating Badges */}
                <div className="absolute -top-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 animate-bounce transition-all hover:scale-110">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-20" />
                      <div className="relative w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-white fill-current" />
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-xl leading-none">4.9/5</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Satisfaction Rate</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-10 -left-6 bg-white/80 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/50 animate-float">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                      <Heart className="w-7 h-7" />
                    </div>
                    <div className="pr-4">
                      <p className="font-black text-slate-900 leading-none">Healthy Choice</p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">Confirmed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-slate-900 to-transparent" />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Leaf, title: "100% Natural", desc: "Pureza garantizada en cada ingrediente seleccionado." },
              { icon: Heart, title: "Salud Primero", desc: "Expertos en bienestar cuidando tu estilo de vida." },
              { icon: Shield, title: "Calidad Premium", desc: "Certificaciones internacionales en cada lote." },
              { icon: Truck, title: "Envío Prioritario", desc: "Despacho en tiempo record a nivel nacional." }
            ].map((benefit, i) => (
              <div key={i} className="group relative flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-all border border-white/10 group-hover:border-emerald-500/30 group-hover:-translate-y-2">
                  <benefit.icon className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest mb-3">{benefit.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruitment Banner */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 60L60 30L30 0L0 30L30 60Z' fill='%23fff' opacity='0.4'/%3E%3C/svg%3E")`,
        }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-300/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 blur-3xl rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-bold text-xs mb-6 uppercase tracking-[0.2em] border border-white/30">
                <Rocket className="w-3.5 h-3.5" />
                Oportunidad de Negocio
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
                ¿Querés hacer más que <br />
                <span className="underline decoration-4 underline-offset-8 decoration-amber-300">solo comprar</span>?
              </h2>
              <p className="text-lg sm:text-xl text-emerald-50 mb-8 leading-relaxed max-w-xl">
                Convertite en empresario Inspire y construí tu propio negocio con productos premium, comisiones atractivas y un equipo que te acompaña.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/oportunidad"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-emerald-700 font-black rounded-2xl hover:bg-emerald-50 transition-all shadow-2xl shadow-emerald-900/30 active:scale-95"
                >
                  <Rocket className="w-5 h-5" />
                  CONOCER LA OPORTUNIDAD
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href={sponsorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-900/30 border-2 border-white/30 backdrop-blur-sm text-white font-black rounded-2xl hover:bg-emerald-900/50 transition-all active:scale-95"
                >
                  REGISTRARME YA
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20 text-white">
                <Users className="w-10 h-10 mb-4 text-amber-200" />
                <p className="text-3xl font-black mb-1">+500</p>
                <p className="text-xs uppercase tracking-widest font-bold text-emerald-50">Empresarios</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20 text-white mt-8">
                <TrendingUp className="w-10 h-10 mb-4 text-amber-200" />
                <p className="text-3xl font-black mb-1">Crecer</p>
                <p className="text-xs uppercase tracking-widest font-bold text-emerald-50">Sin Techo</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20 text-white">
                <Heart className="w-10 h-10 mb-4 text-amber-200" />
                <p className="text-3xl font-black mb-1">Flexible</p>
                <p className="text-xs uppercase tracking-widest font-bold text-emerald-50">Tu Horario</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20 text-white mt-8">
                <Award className="w-10 h-10 mb-4 text-amber-200" />
                <p className="text-3xl font-black mb-1">Premium</p>
                <p className="text-xs uppercase tracking-widest font-bold text-emerald-50">Productos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-32 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <div className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest mb-4">
                Colección Premium
              </div>
              <h2 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6">
                Catálogo de <br />
                <span className="text-emerald-600 underline decoration-4 decoration-emerald-200 underline-offset-8">Excelencia</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium">
                Seleccionamos solo lo mejor para que tú no tengas que preocuparte de nada más que de disfrutar.
              </p>
            </div>
            <Link 
              href="#products" 
              className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-black hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm active:scale-95"
            >
              VER TODOS
              <ChevronDown className="w-5 h-5 text-emerald-400" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {!featuredProducts.length && (
            <div className="bg-white rounded-3xl p-20 text-center border-4 border-dashed border-slate-200">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <ShoppingBag className="w-10 h-10 text-slate-300" />
               </div>
               <p className="text-slate-400 font-bold text-xl uppercase tracking-widest">No hay productos disponibles aún</p>
               <Link href="/admin" className="text-emerald-600 flex items-center justify-center gap-2 mt-4 hover:underline">
                 Vaya al Portal Admin e importe su primer producto <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 40L40 20L20 0L0 20L20 40Z' fill='%23fff'/%3E%3C/svg%3E")`,
        }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 leading-tight">
            Dos caminos, <br />
            <span className="text-emerald-400 underline decoration-4 underline-offset-8 decoration-emerald-500/40">una misma visión.</span>
          </h2>
          <p className="text-xl sm:text-2xl text-slate-300 mb-12 font-medium opacity-90 max-w-2xl mx-auto">
            Comprá lo que mejora tu vida, o construí un negocio que transforma la de otros.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#products"
              className="inline-flex items-center justify-center gap-4 px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-2xl active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              VER CATÁLOGO
            </Link>
            <Link
              href="/oportunidad"
              className="inline-flex items-center justify-center gap-4 px-10 py-5 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/30 active:scale-95"
            >
              <Rocket className="w-5 h-5" />
              SER EMPRESARIO
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
            <h2 className="text-4xl font-black text-slate-900">Nuestra Comunidad Opina</h2>
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />)}
              <span className="font-black text-slate-900 ml-2">4.9 Average</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { name: "María García", text: "Excelente calidad en los productos. El aceite de coco que compré es espetacular. Totalmente recomendado!", city: "Santo Domingo" },
              { name: "Carlos Rodríguez", text: "Me encanta la variedad de productos naturales que tienen. El Matcha es premium, muy buen precio también.", city: "Santiago" },
              { name: "Ana López", text: "Entrega super rápida y los productos llegan muy bien empacados. Ya es mi tienda favorita de productos naturales.", city: "Bavaro" }
            ].map((t, i) => (
              <div key={i} className="group bg-slate-50 p-10 rounded-[2.5rem] relative transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 border border-transparent hover:border-slate-100">
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-600 text-lg font-medium leading-relaxed mb-8 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4 border-t border-slate-200 pt-8">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-emerald-600 shadow-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 leading-none">{t.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight, Users, TrendingUp, Heart, Globe, CheckCircle2,
  DollarSign, Clock, Award, ChevronDown, Sparkles, Rocket,
  MessageCircle, Briefcase
} from "lucide-react";
import { useAffiliateStore, buildWhatsappUrl } from "@/stores/affiliateStore";
import { cn } from "@/lib/utils";

const BENEFITS = [
  {
    icon: DollarSign,
    title: "Comisiones Atractivas",
    desc: "Gana por cada venta que hagas y por el equipo que construyas en tu red. Ingreso residual real.",
  },
  {
    icon: Clock,
    title: "Flexibilidad Total",
    desc: "Trabaja desde cualquier lugar, a tu ritmo. Tú decides cuánto tiempo invertir cada día.",
  },
  {
    icon: Award,
    title: "Productos Premium",
    desc: "Representas una marca con productos 100% naturales, respaldados científicamente y con alta recompra.",
  },
  {
    icon: Users,
    title: "Comunidad y Formación",
    desc: "Acceso a capacitación continua, sistema probado y un equipo que te acompaña en el camino.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Regístrate como empresario",
    desc: "Haz clic en el botón de registro y completa tus datos. Automáticamente quedas en mi equipo.",
  },
  {
    num: "02",
    title: "Accede a tu kit de inicio",
    desc: "Recibes tu oficina virtual, material de capacitación y productos para arrancar.",
  },
  {
    num: "03",
    title: "Comparte productos y oportunidad",
    desc: "Usa tu link único para vender productos y reclutar más empresarios en tu red.",
  },
  {
    num: "04",
    title: "Crece y gana",
    desc: "Construye tu propio negocio con comisiones por ventas directas y bonos por tu equipo.",
  },
];

const FAQ = [
  {
    q: "¿Necesito experiencia previa en ventas?",
    a: "Para nada. Inspire cuenta con un sistema de formación completo para principiantes. Si tú aprendiste a usar WhatsApp, puedes hacer esto.",
  },
  {
    q: "¿Cuánto cuesta registrarse?",
    a: "El registro incluye un kit de inicio accesible con productos para consumo propio o reventa. Los detalles actualizados los vas a ver en el formulario de registro de Inspire.",
  },
  {
    q: "¿Cómo cobro mis comisiones?",
    a: "Inspire paga directamente a tu cuenta bancaria de forma periódica según el plan de compensación vigente. Todo transparente y trazable desde tu oficina virtual.",
  },
  {
    q: "¿Tengo que comprar productos todos los meses?",
    a: "Depende del plan que elijas. Hay suscripciones opcionales (como el Kit Longevidad) que facilitan mantener tu rango, pero no son obligatorias para empezar.",
  },
  {
    q: "¿Puedo dedicarle medio tiempo?",
    a: "Sí. Muchos de los mejores empresarios arrancaron en sus ratos libres. La clave es constancia, no cantidad de horas.",
  },
  {
    q: "¿Qué soporte voy a recibir de mi parte?",
    a: "Te voy a acompañar personalmente: capacitación inicial, grupos de mentoría y seguimiento semanal. No estás solo.",
  },
];

export default function OportunidadPage() {
  const { sponsorUrl, affiliateName, whatsappNumber, tagline, fetchConfig } = useAffiliateStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const whatsappMessage = `Hola ${affiliateName}! Me interesa conocer más sobre la oportunidad de negocio de Inspire. ¿Puedes contarme más?`;
  const whatsappUrl = whatsappNumber
    ? buildWhatsappUrl(whatsappNumber, whatsappMessage)
    : "#";

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white">
        {/* Animated background */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-400 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full text-emerald-300 font-bold text-xs mb-8 uppercase tracking-[0.2em] border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Oportunidad de Negocio Inspire
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-8">
              Conviértete en <br />
              <span className="text-emerald-400">empresario Inspire</span>
            </h1>

            <p className="text-lg sm:text-2xl text-slate-300 mb-10 max-w-2xl font-medium leading-relaxed">
              {tagline || "No solo compras productos. Construyes tu propio negocio con una marca premium de bienestar."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={sponsorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/30 active:scale-95"
              >
                <Rocket className="w-5 h-5" />
                REGISTRARME AHORA
                <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-10 py-5 bg-white/10 border-2 border-white/20 backdrop-blur-sm text-white font-black rounded-2xl hover:bg-white/20 transition-all active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                HABLAR POR WHATSAPP
              </a>
            </div>

            <div className="flex flex-wrap gap-8 mt-16 pt-10 border-t border-white/10">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm font-bold text-slate-200">Sin inversión alta</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm font-bold text-slate-200">Productos con alta recompra</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm font-bold text-slate-200">Capacitación incluida</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest mb-4">
              Beneficios
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
              ¿Por qué sumarte a <span className="text-emerald-600">Inspire</span>?
            </h2>
            <p className="text-xl text-slate-500 font-medium">
              No es solo vender. Es construir un activo que te genera ingresos aunque no estés trabajando.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                className="group relative p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-emerald-500/10 transition-all hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all text-emerald-600">
                  <b.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-3">{b.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-block px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest mb-4">
              Cómo funciona
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
              4 pasos simples para empezar
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="relative">
                <div className="text-7xl font-black text-emerald-200 mb-4 leading-none">{s.num}</div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{s.title}</h3>
                <p className="text-slate-500 leading-relaxed">{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 right-0 w-full h-px bg-gradient-to-r from-emerald-200 to-transparent -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
              <div className="text-5xl font-black mb-2">+500</div>
              <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">Empresarios Activos</p>
            </div>
            <div>
              <Globe className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
              <div className="text-5xl font-black mb-2">5+</div>
              <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">Países Presentes</p>
            </div>
            <div>
              <Heart className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
              <div className="text-5xl font-black mb-2">10k+</div>
              <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">Clientes Felices</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full uppercase tracking-widest mb-4">
              Preguntas Frecuentes
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900">
              Antes de empezar, seguro tienes dudas
            </h2>
          </div>

          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-3xl border border-slate-100 overflow-hidden hover:border-emerald-200 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors"
                >
                  <span className="font-black text-slate-900 text-lg pr-4">{item.q}</span>
                  <ChevronDown className={cn(
                    "w-5 h-5 text-emerald-600 flex-shrink-0 transition-transform",
                    openFaq === i && "rotate-180"
                  )} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed animate-in slide-in-from-top-2 duration-300">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 40L40 20L20 0L0 20L20 40Z' fill='%23fff'/%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <Briefcase className="w-16 h-16 mx-auto mb-8 text-white" />
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 leading-tight">
            Tu futuro no se construye solo.
            <br />
            <span className="underline decoration-4 underline-offset-8 decoration-white/40">Empieza hoy.</span>
          </h2>
          <p className="text-xl sm:text-2xl text-emerald-100 mb-12 font-medium opacity-90 max-w-2xl mx-auto">
            Súmate a mi equipo. Te voy a acompañar en cada paso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={sponsorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-4 px-12 py-6 bg-white text-emerald-700 font-black rounded-3xl hover:bg-emerald-50 transition-all shadow-2xl shadow-emerald-900/40 active:scale-95 text-lg"
            >
              REGISTRARME AHORA
              <ArrowRight className="w-6 h-6" />
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-4 px-12 py-6 bg-emerald-900/40 border-2 border-white/30 text-white font-black rounded-3xl hover:bg-emerald-900/60 transition-all active:scale-95 text-lg backdrop-blur-sm"
            >
              <MessageCircle className="w-6 h-6" />
              TENGO DUDAS
            </a>
          </div>

          <Link
            href="/"
            className="inline-block mt-12 text-emerald-100 text-sm font-bold hover:text-white transition-colors"
          >
            ← Volver al catálogo
          </Link>
        </div>
      </section>
    </div>
  );
}

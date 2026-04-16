"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Rocket, MessageCircle, ArrowLeft,
  DollarSign, Clock, Award, Users, Sparkles, ExternalLink
} from "lucide-react";
import { useCompaniesStore } from "@/stores/companiesStore";
import { useAffiliateStore, buildWhatsappUrl } from "@/stores/affiliateStore";

const BENEFITS = [
  {
    icon: DollarSign,
    title: "Comisiones Atractivas",
    desc: "Gana por cada venta que hagas y por el equipo que construyas en tu red.",
  },
  {
    icon: Clock,
    title: "Flexibilidad Total",
    desc: "Trabaja desde cualquier lugar, a tu ritmo. Tú decides cuánto tiempo invertir.",
  },
  {
    icon: Award,
    title: "Productos Premium",
    desc: "Marca respaldada con productos de alta calidad y recompra comprobada.",
  },
  {
    icon: Users,
    title: "Comunidad y Formación",
    desc: "Acceso a capacitación continua y un equipo que te acompaña en el camino.",
  },
];

interface EmpresaPageProps {
  params: Promise<{ slug: string }>;
}

export default function EmpresaPage({ params }: EmpresaPageProps) {
  const { slug } = use(params);

  const companies = useCompaniesStore((s) => s.companies);
  const loaded = useCompaniesStore((s) => s.loaded);
  const fetchCompanies = useCompaniesStore((s) => s.fetchCompanies);

  const whatsappNumber = useAffiliateStore((s) => s.whatsappNumber);
  const affiliateName = useAffiliateStore((s) => s.affiliateName);
  const fetchAffiliate = useAffiliateStore((s) => s.fetchConfig);

  useEffect(() => {
    fetchCompanies();
    fetchAffiliate();
  }, [fetchCompanies, fetchAffiliate]);

  const company = companies.find((c) => c.slug === slug);

  // Loading
  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Not found
  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-3xl flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-slate-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3">Empresa no encontrada</h1>
          <p className="text-slate-500 mb-8">
            No encontramos ninguna empresa con el identificador <code className="bg-slate-100 px-2 py-1 rounded">{slug}</code>.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const whatsappUrl = whatsappNumber
    ? buildWhatsappUrl(
        whatsappNumber,
        `Hola ${affiliateName || ""}! Me interesa saber más sobre ${company.name}. ¿Puedes contarme?`
      )
    : "#";

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section
        className="relative min-h-[80vh] flex items-center overflow-hidden text-white"
        style={{
          background: company.heroImageUrl
            ? `linear-gradient(135deg, rgba(15,23,42,0.75), rgba(15,23,42,0.9)), url("${company.heroImageUrl}") center/cover no-repeat`
            : `linear-gradient(135deg, ${company.brandColor} 0%, #0f172a 100%)`,
        }}
      >
        <div className="absolute top-[10%] right-[5%] w-96 h-96 rounded-full blur-3xl opacity-30" style={{ backgroundColor: company.brandColor }} />
        <div className="absolute bottom-[10%] left-[5%] w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: company.brandColor }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs font-black uppercase tracking-[0.3em] mb-10 transition">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {company.logoUrl ? (
                <div className="relative w-32 h-32 mb-8 bg-white rounded-3xl p-5 shadow-2xl">
                  <Image
                    src={company.logoUrl}
                    alt={`${company.name} logo`}
                    fill
                    sizes="128px"
                    className="object-contain p-2"
                  />
                </div>
              ) : (
                <div
                  className="w-32 h-32 mb-8 rounded-3xl flex items-center justify-center text-5xl font-black text-white shadow-2xl"
                  style={{ backgroundColor: company.brandColor }}
                >
                  {company.name.charAt(0).toUpperCase()}
                </div>
              )}

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
                {company.name}
              </h1>

              {company.description && (
                <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl font-medium leading-relaxed">
                  {company.description}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={company.sponsorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-10 py-5 font-black rounded-2xl transition-all shadow-2xl active:scale-95 text-white"
                  style={{
                    backgroundColor: company.brandColor,
                    boxShadow: `0 25px 50px -12px ${company.brandColor}77`,
                  }}
                >
                  <Rocket className="w-5 h-5" />
                  REGISTRARME EN {company.name.toUpperCase()}
                  <ArrowRight className="w-5 h-5" />
                </a>
                {whatsappNumber && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white font-black rounded-2xl hover:bg-white/20 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    CONSULTAR
                  </a>
                )}
              </div>

              {company.refCode && (
                <p className="mt-8 text-xs font-mono text-white/40 uppercase tracking-widest">
                  Código de referido: <span className="text-white/70">{company.refCode}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-slate-100 text-slate-700 text-[10px] font-black rounded-full uppercase tracking-widest mb-4">
              Por qué unirte
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
              Lo que obtienes con <span style={{ color: company.brandColor }}>{company.name}</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-slate-300 hover:shadow-xl transition-all group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white"
                  style={{ backgroundColor: company.brandColor }}
                >
                  <b.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{b.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="relative py-28 overflow-hidden text-white"
        style={{
          background: `linear-gradient(135deg, ${company.brandColor} 0%, ${company.brandColor}cc 100%)`,
        }}
      >
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-6xl font-black mb-8 leading-tight">
            Empieza con <span className="underline decoration-4 underline-offset-8 decoration-white/40">{company.name}</span> hoy.
          </h2>
          <p className="text-xl sm:text-2xl text-white/80 mb-12 font-medium max-w-2xl mx-auto">
            Registrate con mi link y sumate a mi equipo.
          </p>

          <a
            href={company.sponsorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-4 px-12 py-6 bg-white font-black rounded-3xl hover:bg-white/95 transition-all shadow-2xl active:scale-95 text-lg"
            style={{ color: company.brandColor }}
          >
            REGISTRARME AHORA
            <ExternalLink className="w-6 h-6" />
          </a>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useCompaniesStore, type Company } from "@/stores/companiesStore";
import { cn } from "@/lib/utils";

const AUTO_ROTATE_MS = 6000;

export function CompanyCarousel() {
  const companies = useCompaniesStore((s) => s.companies);
  const fetchCompanies = useCompaniesStore((s) => s.fetchCompanies);
  const loaded = useCompaniesStore((s) => s.loaded);

  const active = companies.filter((c) => c.active);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const next = useCallback(() => {
    setIndex((i) => (active.length ? (i + 1) % active.length : 0));
  }, [active.length]);

  const prev = useCallback(() => {
    setIndex((i) => (active.length ? (i - 1 + active.length) % active.length : 0));
  }, [active.length]);

  // Auto-rotation
  useEffect(() => {
    if (paused || active.length <= 1) return;
    const t = setInterval(next, AUTO_ROTATE_MS);
    return () => clearInterval(t);
  }, [paused, next, active.length]);

  // Reset index if out of bounds - schedule reset for next tick
  useEffect(() => {
    if (active.length && index >= active.length) {
      queueMicrotask(() => setIndex(0));
    }
  }, [active.length, index]);

  if (!loaded) return <CarouselSkeleton />;
  if (active.length === 0) return <EmptyState />;

  const current = active[index];

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Elegant subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-orange-50/20" />
      
      <div className="relative max-w-7xl mx-auto">
        <div 
          className="relative min-h-[650px] lg:min-h-[750px] flex items-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Background images - full bleed with elegant overlay */}
          <div className="absolute inset-0">
            {active.map((company, i) => (
              <div
                key={company.id}
                className={cn(
                  "absolute inset-0 transition-all duration-1000 ease-out",
                  i === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
                )}
              >
                {company.heroImageUrl ? (
                  <>
                    <img
                      src={company.heroImageUrl}
                      alt=""
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Multi-layer gradient for depth */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/20" />
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-orange-100/20" />
                  </>
                ) : (
                  <div 
                    className="w-full h-full bg-gradient-to-br from-slate-50 to-white"
                    style={{ background: `linear-gradient(135deg, ${company.brandColor}10 0%, white 50%, ${company.brandColor}05 100%)` }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Content - Two column layout like official site */}
          <div className="relative w-full px-6 sm:px-8 lg:px-16 py-12 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left column - Text content */}
              <div className="order-2 lg:order-1">
                {/* Slides content */}
                {active.map((company, i) => (
                  <div
                    key={company.id}
                    className={cn(
                      "transition-all duration-700 ease-out",
                      i === index 
                        ? "opacity-100 translate-y-0 relative" 
                        : "opacity-0 translate-y-8 absolute inset-0 pointer-events-none"
                    )}
                  >
                    {/* Brand pill badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 shadow-sm"
                      style={{ backgroundColor: `${company.brandColor}15` }}
                    >
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: company.brandColor }}
                      />
                      <span 
                        className="text-xs font-black uppercase tracking-widest"
                        style={{ color: company.brandColor }}
                      >
                        Empresa Representada
                      </span>
                    </div>

                    {/* Company Logo - Large */}
                    {company.logoUrl ? (
                      <div className="mb-6 inline-block">
                        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-white shadow-lg p-4 flex items-center justify-center border border-slate-100">
                          <img
                            src={company.logoUrl}
                            alt={`${company.name}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-lg mb-6"
                        style={{ backgroundColor: company.brandColor }}
                      >
                        {company.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Title with better typography */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
                      {company.name}
                    </h1>

                    {/* Description with better readability */}
                    {company.description && (
                      <p className="text-lg lg:text-xl text-slate-600 mb-8 max-w-lg leading-relaxed font-medium">
                        {company.description}
                      </p>
                    )}

                    {/* Elegant buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={`/empresa/${company.slug}`}
                        className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white font-black rounded-full hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-95"
                      >
                        <span>CONOCER MÁS</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                      <a
                        href={company.sponsorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center gap-2 px-8 py-4 font-black rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 text-white border-2 border-white/20"
                        style={{
                          backgroundColor: company.brandColor,
                        }}
                      >
                        <span>REGISTRARME</span>
                        <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right column - Visual/Image space (can show product collage or keep empty for clean look) */}
              <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                {active.map((company, i) => (
                  <div
                    key={company.id}
                    className={cn(
                      "transition-all duration-700 ease-out",
                      i === index 
                        ? "opacity-100 translate-x-0 scale-100" 
                        : "opacity-0 translate-x-8 scale-95 absolute pointer-events-none"
                    )}
                  >
                    {/* Decorative element - floating card effect */}
                    <div 
                      className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-3xl overflow-hidden shadow-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${company.brandColor}20 0%, white 100%)`,
                      }}
                    >
                      {company.heroImageUrl ? (
                        <img
                          src={company.heroImageUrl}
                          alt={company.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: `${company.brandColor}15` }}
                        >
                          <span 
                            className="text-8xl font-black"
                            style={{ color: `${company.brandColor}40` }}
                          >
                            {company.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {/* Glossy overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none" />
                    </div>
                    {/* Decorative glow */}
                    <div 
                      className="absolute -inset-4 rounded-full blur-3xl opacity-30 -z-10"
                      style={{ backgroundColor: company.brandColor }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Elegant navigation arrows */}
          {active.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Anterior"
                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white shadow-xl rounded-full flex items-center justify-center hover:shadow-2xl hover:scale-110 transition-all text-slate-700 border border-slate-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={next}
                aria-label="Siguiente"
                className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white shadow-xl rounded-full flex items-center justify-center hover:shadow-2xl hover:scale-110 transition-all text-slate-700 border border-slate-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Elegant progress dots */}
          {active.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {active.map((company, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Ir a empresa ${i + 1}`}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === index
                      ? "w-8"
                      : "w-2 hover:w-4 opacity-50 hover:opacity-100"
                  )}
                  style={{
                    backgroundColor: i === index ? company.brandColor : '#94a3b8'
                  }}
                />
              ))}
            </div>
          )}

          {/* Screen reader */}
          <div className="sr-only" aria-live="polite">
            Empresa {index + 1} de {active.length}: {current.name}
          </div>
        </div>
      </div>
    </section>
  );
}

function CarouselSkeleton() {
  return (
    <section className="relative bg-white">
      <div className="min-h-[650px] lg:min-h-[750px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-slate-400 rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-400">Cargando empresas...</span>
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-white py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 flex items-center justify-center">
          <span className="text-3xl">🏢</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4">Próximamente</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Estamos preparando nuevas empresas para mostrarte. Vuelve pronto.
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-black rounded-full hover:bg-slate-800 transition shadow-lg"
        >
          Administrar empresas
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

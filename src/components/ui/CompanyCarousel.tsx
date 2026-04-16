"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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

  // Reset index if out of bounds
  useEffect(() => {
    if (active.length && index >= active.length) {
      requestAnimationFrame(() => setIndex(0));
    }
  }, [active.length, index]);

  if (!loaded) return <CarouselSkeleton />;
  if (active.length === 0) return <EmptyState />;

  const current = active[index];

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Subtle gradient background like official site */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-orange-50/30" />
      
      {/* Main container */}
      <div className="relative max-w-7xl mx-auto">
        {/* Hero-style carousel */}
        <div 
          className="relative min-h-[600px] lg:min-h-[700px] flex items-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            {active.map((company, i) => (
              <div
                key={company.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-1000",
                  i === index ? "opacity-100" : "opacity-0"
                )}
              >
                {company.heroImageUrl ? (
                  <>
                    <img
                      src={company.heroImageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
                  </>
                ) : (
                  <div 
                    className="w-full h-full"
                    style={{ background: `linear-gradient(135deg, ${company.brandColor}15 0%, ${company.brandColor}05 100%)` }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="relative w-full px-6 sm:px-8 lg:px-16 py-16 lg:py-24">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full mb-6">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-orange-600">
                  Empresa Destacada
                </span>
              </div>

              {/* Slides content */}
              {active.map((company, i) => (
                <div
                  key={company.id}
                  className={cn(
                    "transition-all duration-700",
                    i === index 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-4 absolute pointer-events-none"
                  )}
                >
                  {/* Logo */}
                  <div className="flex items-center gap-4 mb-6">
                    {company.logoUrl ? (
                      <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white shadow-xl p-3 flex items-center justify-center">
                        <img
                          src={company.logoUrl}
                          alt={`${company.name} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl"
                        style={{ backgroundColor: company.brandColor }}
                      >
                        {company.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-4">
                    {company.name}
                  </h1>

                  {/* Description */}
                  {company.description && (
                    <p className="text-lg lg:text-xl text-slate-600 mb-8 max-w-lg leading-relaxed">
                      {company.description}
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={`/empresa/${company.slug}`}
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                    >
                      CONOCER MÁS
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <a
                      href={company.sponsorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 font-black rounded-xl transition-all shadow-lg active:scale-95 text-white"
                      style={{
                        backgroundColor: company.brandColor,
                        boxShadow: `0 10px 30px -5px ${company.brandColor}50`,
                      }}
                    >
                      REGISTRARME AHORA
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows - positioned on sides */}
          {active.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Anterior"
                className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 backdrop-blur shadow-lg rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all text-slate-700"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={next}
                aria-label="Siguiente"
                className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 backdrop-blur shadow-lg rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all text-slate-700"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots - bottom center */}
          {active.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
              {active.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Ir a empresa ${i + 1}`}
                  className={cn(
                    "h-3 rounded-full transition-all",
                    i === index
                      ? "w-10 bg-orange-500"
                      : "w-3 bg-slate-300 hover:bg-slate-400"
                  )}
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
      <div className="min-h-[600px] lg:min-h-[700px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-orange-50/30 py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-4">Próximamente</h2>
        <p className="text-slate-600 mb-8">
          Estamos preparando nuevas empresas para mostrarte.
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition"
        >
          Administrar empresas
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

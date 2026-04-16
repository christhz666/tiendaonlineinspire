"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Leaf, Mail, MessageCircle, MapPin, Rocket, Award, ExternalLink } from "lucide-react";
import { useAffiliateStore, buildWhatsappUrl } from "@/stores/affiliateStore";

export function Footer() {
  const affiliateName = useAffiliateStore((s) => s.affiliateName);
  const whatsappNumber = useAffiliateStore((s) => s.whatsappNumber);
  const email = useAffiliateStore((s) => s.email);
  const sponsorUrl = useAffiliateStore((s) => s.sponsorUrl);
  const tagline = useAffiliateStore((s) => s.tagline);
  const fetchAffiliate = useAffiliateStore((s) => s.fetchConfig);

  useEffect(() => {
    fetchAffiliate();
  }, [fetchAffiliate]);

  const whatsappUrl = whatsappNumber
    ? buildWhatsappUrl(whatsappNumber, `Hola ${affiliateName || ""}! Te escribo desde tu catálogo Inspire.`)
    : "#";

  return (
    <footer className="bg-slate-900 text-slate-400 pt-20 pb-10 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand & Mission */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Inspire<span className="text-emerald-500">Su Vida</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              {tagline || "Tu socio afiliado oficial de Inspire International. Catálogo de productos premium de bienestar y oportunidad de negocio."}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-900/30 border border-emerald-500/20 rounded-full">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Afiliado Oficial</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Navegación</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-sm font-medium hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/#products"
                  className="text-sm font-medium hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  href="/oportunidad"
                  className="text-sm font-medium hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Oportunidad
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-sm font-medium hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                >
                  <div className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  Panel Afiliado
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Contacto</h4>
            <ul className="space-y-6">
              {whatsappNumber && (
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">WhatsApp</p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white font-medium hover:text-emerald-400 transition-colors"
                    >
                      {whatsappNumber}
                    </a>
                  </div>
                </li>
              )}
              {email && (
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Escríbenos</p>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm text-white font-medium hover:text-emerald-400 transition-colors break-all"
                    >
                      {email}
                    </a>
                  </div>
                </li>
              )}
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Ubicación</p>
                  <p className="text-sm text-white font-medium">República Dominicana</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Opportunity CTA */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-600/20 via-emerald-500/10 to-transparent border border-emerald-500/30 p-6 rounded-3xl">
              <div className="flex items-center gap-2 mb-3">
                <Rocket className="w-5 h-5 text-emerald-400" />
                <h4 className="text-emerald-400 font-black uppercase tracking-widest text-xs">Ser Empresario</h4>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Súmate al equipo Inspire. Comisiones, productos premium y formación.
              </p>
              <a
                href={sponsorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-emerald-500 text-white px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 transition-all"
              >
                Registrarme
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="pt-2">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-loose">
                Hecho con <span className="text-emerald-500">❤️</span> para una vida saludable en República Dominicana.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-20 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-medium text-slate-600">
            &copy; {new Date().getFullYear()} Inspire Su Vida. Afiliado independiente de Inspire International.
          </p>
          <div className="flex gap-8">
            <Link href="/oportunidad" className="text-xs font-medium hover:text-emerald-400">Oportunidad</Link>
            <Link href="/#products" className="text-xs font-medium hover:text-emerald-400">Catálogo</Link>
            {whatsappNumber && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:text-emerald-400">
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

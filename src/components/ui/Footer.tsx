"use client";

import Link from "next/link";
import { Leaf, Mail, Phone, MapPin, Camera, Share2, Globe, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-20 pb-10 overflow-hidden relative">
      {/* Decorative gradient */}
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
              Dedicados a traer la pureza de la naturaleza a tu puerta. Seleccionamos cuidadosamente cada producto para garantizar tu bienestar y el respeto por el medio ambiente.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Camera, href: "#" },
                { icon: Share2, href: "#" },
                { icon: Globe, href: "#" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all transform hover:-translate-y-1"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Navegación</h4>
            <ul className="space-y-4">
              {["Inicio", "Productos", "Sobre Nosotros", "Portal Admin", "Contacto"].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === "Portal Admin" ? "/admin" : item === "Productos" ? "/#products" : "/"} 
                    className="text-sm font-medium hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8">Contacto</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Llámanos</p>
                  <p className="text-sm text-white font-medium">+1 (809) 555-0123</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Escríbenos</p>
                  <p className="text-sm text-white font-medium">hola@inspiresuvida.do</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Ubicación</p>
                  <p className="text-sm text-white font-medium">Santiago, República Dominicana</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter / trust */}
          <div className="space-y-8">
            <div className="bg-emerald-600/10 border border-emerald-500/20 p-6 rounded-3xl">
              <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Compra Segura
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Tus transacciones están protegidas por encriptación avanzada de 256-bit vía PayPal.
              </p>
              <div className="flex gap-2 flex-wrap">
                <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold">VISA</div>
                <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold">MC</div>
                <div className="h-6 w-10 bg-white/10 rounded flex items-center justify-center text-[8px] font-bold text-blue-400">PayPal</div>
              </div>
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
            &copy; {new Date().getFullYear()} Inspire Su Vida. Una marca de bienestar natural.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-xs font-medium hover:text-emerald-400">Privacidad</Link>
            <Link href="#" className="text-xs font-medium hover:text-emerald-400">Términos</Link>
            <Link href="#" className="text-xs font-medium hover:text-emerald-400">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

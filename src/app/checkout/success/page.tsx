"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Package, Mail, ArrowRight, ShoppingBag, Leaf, Star } from "lucide-react";

const CONFETTI_COLORS = [
  "#10b981", "#059669", "#34d399", "#6ee7b7",
  "#f59e0b", "#fbbf24", "#fcd34d",
  "#3b82f6", "#60a5fa",
];

function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-sm pointer-events-none"
      style={{
        width: Math.random() * 10 + 5,
        height: Math.random() * 10 + 5,
        ...style,
      }}
    />
  );
}

export default function CheckoutSuccessPage() {
  const [particles, setParticles] = useState<{ id: number; style: React.CSSProperties }[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reveal animation
    setVisible(true);

    // Generate confetti particles
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `${-10 - Math.random() * 20}%`,
        backgroundColor: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        transform: `rotate(${Math.random() * 360}deg)`,
        animation: `fall ${1.5 + Math.random() * 2.5}s ease-in ${Math.random() * 1}s forwards`,
      } as React.CSSProperties,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <Particle key={p.id} style={p.style} />
        ))}
      </div>

      <style>{`
        @keyframes fall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
        @keyframes bounceIn {
          0%   { transform: scale(0.3); opacity: 0; }
          50%  { transform: scale(1.05); opacity: 1; }
          70%  { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes slideUp {
          0%   { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .bounce-in { animation: bounceIn 0.7s cubic-bezier(.36,.07,.19,.97) both; }
        .slide-up-1 { animation: slideUp 0.5s ease 0.4s both; }
        .slide-up-2 { animation: slideUp 0.5s ease 0.55s both; }
        .slide-up-3 { animation: slideUp 0.5s ease 0.7s both; }
        .slide-up-4 { animation: slideUp 0.5s ease 0.85s both; }
      `}</style>

      <div className="relative max-w-lg w-full">
        {/* Main card */}
        <div
          className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Green header band */}
          <div className="bg-emerald-600 px-8 pt-10 pb-16 text-center relative">
            <div className="absolute top-0 left-0 right-0 h-full opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            {/* Check icon */}
            <div className="bounce-in relative w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-900/20">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
          </div>

          {/* Content pulled up over the band */}
          <div className="px-8 pb-8 -mt-6">
            {/* Stars */}
            <div className="slide-up-1 flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            <h1 className="slide-up-1 text-3xl font-bold text-slate-900 text-center mb-2">
              ¡Gracias por tu compra!
            </h1>
            <p className="slide-up-2 text-slate-500 text-center mb-8">
              Tu pago fue procesado exitosamente. Estamos preparando tu pedido con mucho cuidado.
            </p>

            {/* Info steps */}
            <div className="slide-up-3 space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Confirmación por correo</p>
                  <p className="text-slate-500 text-xs">Recibirás un email con los detalles de tu orden.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Preparando tu envío</p>
                  <p className="text-slate-500 text-xs">Tu pedido estará en camino en 24-48 horas hábiles.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">100% Natural</p>
                  <p className="text-slate-500 text-xs">Empacado cuidadosamente para preservar la calidad.</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="slide-up-4 flex flex-col gap-3">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-500/20 active:scale-98"
              >
                <ShoppingBag className="w-5 h-5" />
                Seguir Comprando
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-slate-400 text-sm mt-6">
          Inspire Su Vida — Gracias por confiar en nosotros 🌿
        </p>
      </div>
    </div>
  );
}

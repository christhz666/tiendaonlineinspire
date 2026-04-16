"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, MessageCircle, Link as LinkIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

interface ShareButtonProps {
  title: string;
  url: string;
  className?: string;
  iconOnly?: boolean;
  compact?: boolean;
}

export function ShareButton({
  title,
  url,
  className,
  iconOnly = false,
  compact = false,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const message = `¡Mirá este producto de Inspire que te puede interesar! 🌿\n${title}\n${url}`;
  const encodedUrl = encodeURIComponent(url);

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1500);
    } catch {
      // Fallback if clipboard not supported
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1500);
    }
  };

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((v) => !v);
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={toggle}
        aria-label="Compartir producto"
        className={cn(
          "flex items-center justify-center rounded-full transition-all border",
          compact
            ? "w-9 h-9 bg-white/80 backdrop-blur-md border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-white shadow-sm"
            : "gap-2 px-4 py-2 bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 font-bold text-xs uppercase tracking-widest"
        )}
      >
        <Share2 className={compact ? "w-4 h-4" : "w-4 h-4"} />
        {!iconOnly && !compact && <span>Compartir</span>}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 bg-slate-50/50 border-b border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 py-1">Compartir</p>
          </div>
          <div className="p-1 space-y-0.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { e.stopPropagation(); setOpen(false); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                <MessageCircle className="w-4 h-4" />
              </div>
              WhatsApp
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { e.stopPropagation(); setOpen(false); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <FacebookIcon className="w-4 h-4" />
              </div>
              Facebook
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                copied ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
              )}>
                {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
              </div>
              {copied ? "¡Copiado!" : "Copiar link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, use, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProductByHandle } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";
import { useCurrencyStore } from "@/stores/currencyStore";
import { Button } from "@/components/ui/Button";
import { 
  ArrowLeft, ShoppingBag, Check, AlertCircle, Minus, Plus, 
  Truck, Leaf, ShieldCheck, Heart, Share2, Star,
  Info, ChevronDown, Award
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const product = useProductByHandle(resolvedParams.id);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const format = useCurrencyStore((state) => state.format);
  
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("description");

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900">Producto no encontrado</h1>
          <Link href="/" className="text-emerald-600 hover:underline mt-4 inline-block">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants.find(v => v.id === selectedVariantId) || product.variants[0];
  const images = product.images.length > 0 ? product.images : [{ id: '1', url: product.thumbnail }];

  const handleAddToCart = () => {
    try {
      if (!selectedVariant) return;

      addItem({
        productId: product.id,
        variantId: selectedVariant.id,
        title: product.title,
        variantTitle: selectedVariant.title,
        quantity: quantity,
        price: selectedVariant.price,
        image: product.thumbnail,
      });
      
      openCart();
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      setError("Error al agregar al carrito");
    }
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-50/50 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 mb-8 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:border-emerald-200 group-hover:bg-emerald-50">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </div>
          <span className="font-medium">Volver a la tienda</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-200 group">
              <Image
                src={images[activeImageIdx]?.url || product.thumbnail}
                alt={product.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-600 hover:text-red-500 hover:bg-white transition-all shadow-sm">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-600 hover:text-emerald-600 hover:bg-white transition-all shadow-sm">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, i) => (
                  <button
                    key={img.id || i}
                    onClick={() => setActiveImageIdx(i)}
                    className={cn(
                      "relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all",
                      activeImageIdx === i 
                        ? "border-emerald-600 ring-4 ring-emerald-50 shadow-md" 
                        : "border-white hover:border-slate-300"
                    )}
                  >
                    <Image src={img.url} alt="" fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-widest flex items-center gap-1">
                <Leaf className="w-3 h-3" />
                {product.productType || "Natural"}
              </div>
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                <span className="text-slate-400 text-xs ml-1 font-medium">(4.9/5)</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4 lowercase first-letter:uppercase">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <span suppressHydrationWarning className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                {format(selectedVariant?.price || product.priceRange.minPrice)}
              </span>
              {(selectedVariant?.compareAtPrice || product.compareAtPrice) && (
                <div className="flex items-center gap-2">
                  <span suppressHydrationWarning className="text-lg text-slate-400 line-through">
                    {format(selectedVariant?.compareAtPrice || product.compareAtPrice || 0)}
                  </span>
                  <span className="px-2 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg border border-rose-100">
                    OFERTA
                  </span>
                </div>
              )}
            </div>

            {/* Options Selector */}
            {product.options.length > 0 && product.options.some(opt => opt.values.length > 1) && (
              <div className="mb-8 space-y-4">
                {product.options.filter(opt => opt.values.length > 1).map((opt) => (
                  <div key={opt.id}>
                    <p className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                      {opt.name}
                      <span className="text-slate-400 font-normal">Siete opciones</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {opt.values.map((val) => {
                        const variant = product.variants.find(v => 
                          v.options[opt.name.toLowerCase()] === val || v.title === val
                        );
                        const isSelected = variant?.id === selectedVariantId;
                        return (
                          <button
                            key={val}
                            onClick={() => variant && setSelectedVariantId(variant.id)}
                            className={cn(
                              "px-4 py-2 rounded-xl font-semibold text-sm transition-all border-2",
                              isSelected 
                                ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20 scale-105" 
                                : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700 shadow-sm"
                            )}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 pt-4 border-t border-slate-100">
              <div className="flex items-center bg-white rounded-2xl border-2 border-slate-200 p-1 shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-10 text-center font-bold text-slate-900 text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <Button 
                onClick={handleAddToCart}
                className="flex-1 py-7 rounded-2xl text-lg font-bold shadow-xl shadow-emerald-900/10 transition-transform active:scale-[0.98]"
              >
                {addedToCart ? (
                  <div className="flex items-center gap-2 animate-in fade-in zoom-in">
                    <Check className="w-6 h-6" />
                    ¡EN EL CARRITO!
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-6 h-6" />
                    AÑADIR A LA CESTA
                  </div>
                )}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-hover hover:border-emerald-200 hover:shadow-md">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Pago Seguro</p>
                  <p className="text-[10px] text-slate-500">PayPal Encrypt</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-hover hover:border-blue-200 hover:shadow-md">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Envío Rápido</p>
                  <p className="text-[10px] text-slate-500">República Dom.</p>
                </div>
              </div>
            </div>

            {/* Details Accordion */}
            <div className="space-y-2 border-t border-slate-100 pt-8">
              {/* Description */}
              <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm">
                <button 
                  onClick={() => toggleAccordion("description")}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Info className="w-4 h-4 text-emerald-600" />
                    Descripción
                  </div>
                  <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", activeAccordion === "description" ? "rotate-180" : "")} />
                </button>
                {activeAccordion === "description" && (
                  <div className="p-4 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
                    <div 
                      dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }} 
                      className="prose prose-sm prose-emerald max-w-none"
                    />
                  </div>
                )}
              </div>

              {/* Shipping */}
              <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm">
                <button 
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    Envío y Devoluciones
                  </div>
                  <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", activeAccordion === "shipping" ? "rotate-180" : "")} />
                </button>
                {activeAccordion === "shipping" && (
                  <div className="p-4 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-50 animate-in slide-in-from-top-2">
                    {product.shippingInfo && product.shippingInfo.length > 0 ? (
                      <ul className="space-y-2">
                        {product.shippingInfo.map((info, idx) => (
                          <li key={idx} className="flex gap-2">
                            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            {info}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Envío estándar a todo el país. Entrega estimada en 2-4 días hábiles.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Quality Guarantee */}
              <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm">
                <button 
                  onClick={() => toggleAccordion("quality")}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Garantía de Calidad
                  </div>
                  <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", activeAccordion === "quality" ? "rotate-180" : "")} />
                </button>
                {activeAccordion === "quality" && (
                  <div className="p-4 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-50 animate-in slide-in-from-top-2">
                    <p>Todos nuestros productos son seleccionados cuidadosamente para asegurar que recibas solo lo mejor de la naturaleza. Calidad premium garantizada 100%.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Placeholder */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">También te puede gustar</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 opacity-60">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-3xl p-4 border border-slate-100 animate-pulse">
                <div className="aspect-square bg-slate-100 rounded-2xl mb-4" />
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCurrencyStore } from "@/stores/currencyStore";
import { useAffiliateStore, withAffiliateRef } from "@/stores/affiliateStore";
import { Button } from "./Button";
import { ShareButton } from "./ShareButton";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const format = useCurrencyStore((state) => state.format);
  const refCode = useAffiliateStore((state) => state.refCode);

  const affiliateUrl = product.externalUrl
    ? withAffiliateRef(product.externalUrl, refCode)
    : "";

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (affiliateUrl) {
      window.open(affiliateUrl, "_blank", "noopener,noreferrer");
    }
  };


  return (
    <div 
      className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
      data-testid={`product-card-${product.id}`}
    >
      {/* Image link */}
      <div className="relative">
        <Link href={`/product/${product.handle}`}>
          <div className="relative aspect-square overflow-hidden bg-slate-100">
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
        </Link>
        {affiliateUrl && (
          <div className="absolute top-3 right-3 z-10">
            <ShareButton title={product.title} url={affiliateUrl} compact />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Product info link */}
        <Link href={`/product/${product.handle}`} className="mb-4">
          <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">
            {product.productType}
          </p>
          <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-slate-500 mb-3 line-clamp-2">
            {product.description}
          </p>
        </Link>
        
        {/* Price and button */}
        <div className="flex items-center justify-between">
          <div>
            <span suppressHydrationWarning className="text-lg font-bold text-slate-900">
              {format(product.priceRange.minPrice)}
            </span>
            {product.priceRange.maxPrice > product.priceRange.minPrice && (
              <span suppressHydrationWarning className="text-sm text-slate-500 ml-1">
                - {format(product.priceRange.maxPrice)}
              </span>
            )}
          </div>
          
          <Button 
            size="sm" 
            className="relative px-5 bg-emerald-600 hover:bg-emerald-700"
            onClick={handleBuyClick}
            disabled={!product.externalUrl}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            {product.externalUrl ? "Comprar en Inspire" : "No disponible"}
          </Button>
        </div>
      </div>
    </div>
  );
}
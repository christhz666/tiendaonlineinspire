"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCartStore } from "@/stores/cartStore";
import { useCurrencyStore } from "@/stores/currencyStore";
import { useEffect } from "react";
import { Button } from "./Button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const format = useCurrencyStore((state) => state.format);
  
  // Add debug effect to see if component mounts
  useEffect(() => {
    console.log(`[ProductCard] Mounted for product: ${product.title}`);
  }, [product.title]);

  const handleAddToCart = (e: React.MouseEvent) => {
    console.log(`[ProductCard] handleAddToCart called for ${product.title}`);
    console.log(`[ProductCard] Event target:`, e.target);
    console.log(`[ProductCard] addItem function:`, typeof addItem);
    console.log(`[ProductCard] openCart function:`, typeof openCart);
    
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.variants || product.variants.length === 0) {
      console.error(`[ProductCard] No variants for product: ${product.title}`);
      return;
    }
    
    try {
      const firstVariant = product.variants[0];
      console.log(`[ProductCard] Selected variant:`, firstVariant);
      
      const cartItem = {
        productId: product.id,
        variantId: firstVariant.id,
        title: product.title,
        variantTitle: firstVariant.title,
        quantity: 1,
        price: firstVariant.price,
        image: product.thumbnail,
      };
      
      console.log(`[ProductCard] Adding item to cart:`, cartItem);
      
      // Call the store functions
      addItem(cartItem);
      console.log(`[ProductCard] addItem called successfully`);
      
      openCart();
      console.log(`[ProductCard] openCart called successfully`);
      
    } catch (error) {
      console.error(`[ProductCard] Error adding to cart:`, error);
    }
  };


  return (
    <div 
      className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
      data-testid={`product-card-${product.id}`}
    >
      {/* Image link */}
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
            onClick={handleAddToCart}
            className="relative"
          >
            <ShoppingBag className="w-4 h-4 mr-1.5" />
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}
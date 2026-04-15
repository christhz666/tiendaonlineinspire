export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  inventoryQuantity: number;
  options: Record<string, string>;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  vendor: string;
  productType: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  images: ProductImage[];
  thumbnail: string;
  variants: ProductVariant[];
  options: { id: string; name: string; values: string[] }[];
  priceRange: {
    minPrice: number;
    maxPrice: number;
  };
  compareAtPrice?: number; // Precio tachado global
  features?: string[];    // Ej: "Vegano", "Libre de lácteos"
  shippingInfo?: string[]; // Ej: "Envíos en 2-5 días"
  badges?: string[];       // Ej: "Recibe tus productos favoritos cada mes"
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  quantity: number;
  price: number;
  image: string;
}

export interface ScrapedProductData {
  title: string;
  description: string;
  price?: number;
  compareAtPrice?: number;
  currency?: string;
  images: string[];
  vendor?: string;
  availability?: string;
  url: string;
  features: string[];
  shippingInfo: string[];
  badges: string[];
  variants?: Array<{
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    available: boolean;
  }>;
}

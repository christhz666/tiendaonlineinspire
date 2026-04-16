import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/types";
import { supabase } from "@/lib/supabase";

interface ProductStore {
  products: Product[];
  featuredProducts: Product[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: () => Promise<void>;
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Getters
  getProductById: (id: string) => Product | undefined;
  getProductByHandle: (handle: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
}

const sampleProducts: Product[] = [
  {
    id: "prod_1",
    title: "Aceite de Coco Orgánico",
    handle: "aceite-coco-organico",
    description: "Aceite de coco 100% orgánico, prensado en frío. Ideal para cocina sana y cuidados de la piel. Rico en ácidos grasos esenciales.",
    vendor: "Naturista",
    productType: "Aceites",
    tags: ["organico", "aceite", "cocina-sana"],
    status: "published",
    images: [{ id: "img_1", url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800" }],
    thumbnail: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
    variants: [
      { id: "var_1_1", title: "250ml", price: 1299, inventoryQuantity: 50, options: { tamaño: "250ml" } },
      { id: "var_1_2", title: "500ml", price: 2199, inventoryQuantity: 30, options: { tamaño: "500ml" } }
    ],
    options: [{ id: "opt_1", name: "Tamaño", values: ["250ml", "500ml"] }],
    priceRange: { minPrice: 1299, maxPrice: 2199 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      featuredProducts: [],
      loading: false,
      error: null,

      fetchProducts: async () => {
        set({ loading: true });
        try {
          const { data, error } = await supabase.from('products').select('*');
          if (error) throw error;
          
          if (data && data.length > 0) {
            // Transform snake_case from DB if needed, but our SQL matches camelCase mostly (except descriptions)
            // If the user used the SQL I provided, we need to map names.
            const mappedData = data.map((p: any) => ({
                ...p,
                descriptionHtml: p.description_html ?? p.descriptionHtml,
                productType: p.product_type ?? p.productType,
                priceRange: p.price_range ?? p.priceRange,
                compareAtPrice: p.compare_at_price ?? p.compareAtPrice,
                shippingInfo: p.shipping_info ?? p.shippingInfo,
                externalUrl: p.external_url ?? p.externalUrl,
                createdAt: p.created_at ?? p.createdAt,
                updatedAt: p.updated_at ?? p.updated_at
            }));
            set({ products: mappedData, featuredProducts: mappedData.filter((p: any) => p.status === "published") });
          } else {
            // If empty, we can keep current or show samples
            set({ products: sampleProducts, featuredProducts: sampleProducts });
          }
        } catch (err: any) {
          console.error("DEBUG - Env present:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);
          console.error("Fetch products error (raw):", err);
          console.error("Fetch products error (stringified):", JSON.stringify(err, Object.getOwnPropertyNames(err)));
          set({ error: err.message || "Error de conexión con Supabase" });
        } finally {
          set({ loading: false });
        }
      },

      setProducts: (products) => set({ products, featuredProducts: products.filter(p => p.status === "published") }),
      
      addProduct: async (product) => {
        try {
            const { error } = await supabase.from('products').insert([{
                id: product.id,
                title: product.title,
                handle: product.handle,
                description: product.description,
                description_html: product.descriptionHtml,
                vendor: product.vendor,
                product_type: product.productType,
                tags: product.tags,
                status: product.status,
                images: product.images,
                thumbnail: product.thumbnail,
                variants: product.variants,
                options: product.options,
                price_range: product.priceRange,
                compare_at_price: product.compareAtPrice,
                features: product.features,
                shipping_info: product.shippingInfo,
                badges: product.badges,
                external_url: product.externalUrl
            }]);
            if (error) throw error;
            
            set((state) => ({
                products: [...state.products, product],
                featuredProducts: product.status === "published" 
                    ? [...state.featuredProducts, product]
                    : state.featuredProducts
            }));
        } catch (err: any) {
            console.error("Add product error:", err);
        }
      },
      
      updateProduct: async (id, data) => {
        try {
            // Map keys for Supabase
            const updateData: any = { ...data };
            if (data.descriptionHtml) updateData.description_html = data.descriptionHtml;
            if (data.productType) updateData.product_type = data.productType;
            if (data.priceRange) updateData.price_range = data.priceRange;
            if (data.externalUrl !== undefined) {
              updateData.external_url = data.externalUrl;
              delete updateData.externalUrl;
            }
            
            const { error } = await supabase.from('products').update(updateData).eq('id', id);
            if (error) throw error;

            set((state) => ({
                products: state.products.map(p => p.id === id ? { ...p, ...data } : p),
                featuredProducts: state.featuredProducts.map(p => p.id === id ? { ...p, ...data } : p)
            }));
        } catch (err: any) {
            console.error("Update product error:", err);
        }
      },
      
      deleteProduct: async (id) => {
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            
            set((state) => ({
                products: state.products.filter(p => p.id !== id),
                featuredProducts: state.featuredProducts.filter(p => p.id !== id)
            }));
        } catch (err: any) {
            console.error("Delete product error:", err);
        }
      },
      
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      getProductById: (id) => get().products.find(p => p.id === id),
      getProductByHandle: (handle) => get().products.find(p => p.handle === handle),
      
      searchProducts: (query) => {
        const q = query.toLowerCase();
        return get().products.filter(p => 
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
        );
      }
    }),
    {
      name: "product-storage",
      partialize: (state) => ({
        products: state.products,
        featuredProducts: state.featuredProducts,
      }),
    }
  )
);

export const useProducts = () => useProductStore(useShallow((state) => state.products));
export const useFeaturedProducts = () => useProductStore(useShallow((state) => state.featuredProducts));
export const useProductById = (id: string) => useProductStore(useShallow((state) => state.products.find(p => p.id === id)));
export const useProductByHandle = (handle: string) => useProductStore(useShallow((state) => state.products.find(p => p.handle === handle)));

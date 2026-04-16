// Auto-generated from Supabase schema via MCP `generate_typescript_types`.
// Regenerate with: npx supabase gen types typescript --project-id sijmwejqircywcosrmfl
// Last updated: 2026-04-16

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      affiliate_config: {
        Row: {
          affiliate_name: string | null
          email: string | null
          id: string
          office_url: string | null
          ref_code: string
          sponsor_url: string
          tagline: string | null
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          affiliate_name?: string | null
          email?: string | null
          id?: string
          office_url?: string | null
          ref_code: string
          sponsor_url: string
          tagline?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          affiliate_name?: string | null
          email?: string | null
          id?: string
          office_url?: string | null
          ref_code?: string
          sponsor_url?: string
          tagline?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          badges: Json | null
          compare_at_price: number | null
          created_at: string | null
          description: string | null
          description_html: string | null
          external_url: string | null
          features: Json | null
          handle: string
          id: string
          images: Json | null
          options: Json | null
          price_range: Json | null
          product_type: string | null
          shipping_info: Json | null
          status: string | null
          tags: Json | null
          thumbnail: string | null
          title: string
          updated_at: string | null
          variants: Json | null
          vendor: string | null
        }
        Insert: {
          badges?: Json | null
          compare_at_price?: number | null
          created_at?: string | null
          description?: string | null
          description_html?: string | null
          external_url?: string | null
          features?: Json | null
          handle: string
          id: string
          images?: Json | null
          options?: Json | null
          price_range?: Json | null
          product_type?: string | null
          shipping_info?: Json | null
          status?: string | null
          tags?: Json | null
          thumbnail?: string | null
          title: string
          updated_at?: string | null
          variants?: Json | null
          vendor?: string | null
        }
        Update: {
          badges?: Json | null
          compare_at_price?: number | null
          created_at?: string | null
          description?: string | null
          description_html?: string | null
          external_url?: string | null
          features?: Json | null
          handle?: string
          id?: string
          images?: Json | null
          options?: Json | null
          price_range?: Json | null
          product_type?: string | null
          shipping_info?: Json | null
          status?: string | null
          tags?: Json | null
          thumbnail?: string | null
          title?: string
          updated_at?: string | null
          variants?: Json | null
          vendor?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type AffiliateConfigRow = Database["public"]["Tables"]["affiliate_config"]["Row"]
export type AffiliateConfigInsert = Database["public"]["Tables"]["affiliate_config"]["Insert"]
export type AffiliateConfigUpdate = Database["public"]["Tables"]["affiliate_config"]["Update"]

export type ProductRow = Database["public"]["Tables"]["products"]["Row"]
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"]

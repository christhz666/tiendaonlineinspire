"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";

export interface AffiliateConfig {
  sponsorUrl: string;
  refCode: string;
  affiliateName: string;
  whatsappNumber: string;
  email: string;
  officeUrl: string;
  tagline: string;
}

interface AffiliateStore extends AffiliateConfig {
  loading: boolean;
  loaded: boolean;
  error: string | null;
  fetchConfig: () => Promise<void>;
  updateConfig: (data: Partial<AffiliateConfig>) => Promise<void>;
}

// Safe defaults for first boot / fallback if Supabase fails
const DEFAULTS: AffiliateConfig = {
  sponsorUrl:
    "https://www.oficina.rd.inspiretienda.com/register?ref=MKnDDs9iRvaAd&p=232916",
  refCode: "11048224.MKnDDs9iRvaAd",
  affiliateName: "Cristopher",
  whatsappNumber: "+18498828418",
  email: "cristianroca4@gmail.com",
  officeUrl: "",
  tagline: "Tu socio en el camino al bienestar y la libertad financiera",
};

export const useAffiliateStore = create<AffiliateStore>()(
  persist(
    (set, get) => ({
      ...DEFAULTS,
      loading: false,
      loaded: false,
      error: null,

      fetchConfig: async () => {
        if (get().loading) return;
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from("affiliate_config")
            .select("*")
            .eq("id", "default")
            .maybeSingle();

          if (error) throw error;

          if (data) {
            set({
              sponsorUrl: data.sponsor_url ?? DEFAULTS.sponsorUrl,
              refCode: data.ref_code ?? DEFAULTS.refCode,
              affiliateName: data.affiliate_name ?? DEFAULTS.affiliateName,
              whatsappNumber: data.whatsapp_number ?? DEFAULTS.whatsappNumber,
              email: data.email ?? DEFAULTS.email,
              officeUrl: data.office_url ?? DEFAULTS.officeUrl,
              tagline: data.tagline ?? DEFAULTS.tagline,
              loaded: true,
            });
          } else {
            set({ loaded: true });
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          console.error("[affiliateStore] fetch error:", msg);
          set({ error: msg, loaded: true });
        } finally {
          set({ loading: false });
        }
      },

      updateConfig: async (data) => {
        const current = get();
        const next: AffiliateConfig = {
          sponsorUrl: data.sponsorUrl ?? current.sponsorUrl,
          refCode: data.refCode ?? current.refCode,
          affiliateName: data.affiliateName ?? current.affiliateName,
          whatsappNumber: data.whatsappNumber ?? current.whatsappNumber,
          email: data.email ?? current.email,
          officeUrl: data.officeUrl ?? current.officeUrl,
          tagline: data.tagline ?? current.tagline,
        };

        set({ ...next });

        try {
          // Debug: log current auth state to diagnose RLS failures
          const { data: authData } = await supabase.auth.getUser();
          console.log("[affiliateStore] upsert auth state:", {
            userId: authData.user?.id,
            email: authData.user?.email,
            isSignedIn: !!authData.user,
          });

          const { error } = await supabase
            .from("affiliate_config")
            .upsert(
              {
                id: "default",
                sponsor_url: next.sponsorUrl,
                ref_code: next.refCode,
                affiliate_name: next.affiliateName,
                whatsapp_number: next.whatsappNumber,
                email: next.email,
                office_url: next.officeUrl,
                tagline: next.tagline,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "id" }
            );

          if (error) throw error;
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          console.error("[affiliateStore] update error:", msg);
          set({ error: msg });
          throw err;
        }
      },
    }),
    {
      name: "affiliate-storage",
      partialize: (state) => ({
        sponsorUrl: state.sponsorUrl,
        refCode: state.refCode,
        affiliateName: state.affiliateName,
        whatsappNumber: state.whatsappNumber,
        email: state.email,
        officeUrl: state.officeUrl,
        tagline: state.tagline,
      }),
    }
  )
);

/**
 * Format WhatsApp URL for a pre-composed message.
 */
export function buildWhatsappUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

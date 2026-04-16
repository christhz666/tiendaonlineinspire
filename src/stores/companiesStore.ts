"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export interface Company {
  id: string;
  slug: string;
  name: string;
  description: string;
  logoUrl: string;
  heroImageUrl: string;
  sponsorUrl: string;
  refCode: string;
  brandColor: string;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CompanyInput = Partial<Omit<Company, "id" | "createdAt" | "updatedAt">> &
  Pick<Company, "slug" | "name" | "sponsorUrl">;

interface CompaniesStore {
  companies: Company[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  addCompany: (data: CompanyInput) => Promise<Company | null>;
  updateCompany: (id: string, data: Partial<CompanyInput>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  getBySlug: (slug: string) => Company | undefined;
}

type CompanyRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  hero_image_url: string | null;
  sponsor_url: string;
  ref_code: string | null;
  brand_color: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

function rowToCompany(row: CompanyRow): Company {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    logoUrl: row.logo_url ?? "",
    heroImageUrl: row.hero_image_url ?? "",
    sponsorUrl: row.sponsor_url,
    refCode: row.ref_code ?? "",
    brandColor: row.brand_color ?? "#10b981",
    displayOrder: row.display_order,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function companyToRow(data: Partial<CompanyInput>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (data.slug !== undefined) row.slug = data.slug;
  if (data.name !== undefined) row.name = data.name;
  if (data.description !== undefined) row.description = data.description || null;
  if (data.logoUrl !== undefined) row.logo_url = data.logoUrl || null;
  if (data.heroImageUrl !== undefined) row.hero_image_url = data.heroImageUrl || null;
  if (data.sponsorUrl !== undefined) row.sponsor_url = data.sponsorUrl;
  if (data.refCode !== undefined) row.ref_code = data.refCode || null;
  if (data.brandColor !== undefined) row.brand_color = data.brandColor || "#10b981";
  if (data.displayOrder !== undefined) row.display_order = data.displayOrder;
  if (data.active !== undefined) row.active = data.active;
  return row;
}

export const useCompaniesStore = create<CompaniesStore>((set, get) => ({
  companies: [],
  loading: false,
  loaded: false,
  error: null,

  fetchCompanies: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;

      set({
        companies: (data || []).map((row) => rowToCompany(row as CompanyRow)),
        loaded: true,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("[companiesStore] fetch error:", msg);
      set({ error: msg, loaded: true });
    } finally {
      set({ loading: false });
    }
  },

  addCompany: async (data) => {
    set({ error: null });
    try {
      const rowData = companyToRow(data);
      console.log("[companiesStore] inserting:", rowData);
      const { data: row, error } = await supabase
        .from("companies")
        .insert(rowData)
        .select()
        .single();

      if (error) {
        console.error("[companiesStore] Supabase error:", error);
        throw error;
      }
      const company = rowToCompany(row as CompanyRow);
      set({ companies: [...get().companies, company].sort((a, b) => a.displayOrder - b.displayOrder) });
      return company;
    } catch (err) {
      console.error("[companiesStore] add error full:", err);
      const msg = err && typeof err === "object" && "message" in err
        ? String(err.message)
        : err instanceof Error
          ? err.message
          : "Unknown error";
      set({ error: msg });
      throw err;
    }
  },

  updateCompany: async (id, data) => {
    set({ error: null });
    try {
      const { data: row, error } = await supabase
        .from("companies")
        .update(companyToRow(data))
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      const updated = rowToCompany(row as CompanyRow);
      set({
        companies: get()
          .companies.map((c) => (c.id === id ? updated : c))
          .sort((a, b) => a.displayOrder - b.displayOrder),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("[companiesStore] update error:", msg);
      set({ error: msg });
      throw err;
    }
  },

  deleteCompany: async (id) => {
    set({ error: null });
    try {
      const { error } = await supabase.from("companies").delete().eq("id", id);
      if (error) throw error;
      set({ companies: get().companies.filter((c) => c.id !== id) });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("[companiesStore] delete error:", msg);
      set({ error: msg });
      throw err;
    }
  },

  getBySlug: (slug) => get().companies.find((c) => c.slug === slug),
}));

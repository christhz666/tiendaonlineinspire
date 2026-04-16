-- ============================================================
-- COMPANIES MIGRATION — multi-empresa con sub-páginas y hero carousel
-- ============================================================
-- Corré este archivo entero en Supabase → SQL Editor → RUN
-- ============================================================

-- 1. Tabla companies
CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  logo_url text,
  hero_image_url text,
  sponsor_url text NOT NULL,
  ref_code text,
  brand_color text DEFAULT '#10b981',
  display_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- 2. Trigger auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_companies_updated_at ON public.companies;
CREATE TRIGGER set_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. RLS policies (reutilizamos is_admin() creada en 20260416_admin_auth.sql)
DROP POLICY IF EXISTS "public_read_companies" ON public.companies;
DROP POLICY IF EXISTS "admin_insert_companies" ON public.companies;
DROP POLICY IF EXISTS "admin_update_companies" ON public.companies;
DROP POLICY IF EXISTS "admin_delete_companies" ON public.companies;

-- SELECT: público puede leer TODAS (incluso inactivas — el front decide qué mostrar)
CREATE POLICY "public_read_companies"
ON public.companies FOR SELECT TO public
USING (true);

-- WRITES: solo admins
CREATE POLICY "admin_insert_companies"
ON public.companies FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "admin_update_companies"
ON public.companies FOR UPDATE TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admin_delete_companies"
ON public.companies FOR DELETE TO authenticated
USING (public.is_admin());

-- 4. Seed inicial: Inspire como primera empresa (usando datos del affiliate_config actual)
INSERT INTO public.companies (slug, name, description, sponsor_url, ref_code, brand_color, display_order, active)
VALUES (
  'inspire',
  'Inspire',
  'Productos premium de bienestar 100% naturales con respaldo científico. Suma vitalidad a tu rutina diaria.',
  'https://www.oficina.rd.inspiretienda.com/register?ref=MKnDDs9iRvaAd&p=232916',
  '11048224.MKnDDs9iRvaAd',
  '#10b981',
  0,
  true
)
ON CONFLICT (slug) DO NOTHING;

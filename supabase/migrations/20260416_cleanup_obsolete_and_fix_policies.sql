-- Migration: Clean up obsolete tables and consolidate RLS policies.
-- Applied via Supabase MCP on 2026-04-16.
--
-- Changes:
-- 1. Drop public.orders (obsolete, code removed when checkout was eliminated)
-- 2. Split ALL policies into specific INSERT/UPDATE/DELETE on affiliate_config
--    and products to eliminate "multiple permissive policies" performance warnings.

-- 1. Drop obsolete orders table
drop table if exists public.orders;

-- 2. affiliate_config: split ALL policy into specific commands
drop policy if exists "public write affiliate_config" on public.affiliate_config;

create policy "affiliate_config_insert" on public.affiliate_config
  for insert with check (true);

create policy "affiliate_config_update" on public.affiliate_config
  for update using (true) with check (true);

create policy "affiliate_config_delete" on public.affiliate_config
  for delete using (true);

-- 3. products: split ALL policy into specific commands
drop policy if exists "Permitir gestión total a administradores" on public.products;

create policy "products_insert" on public.products
  for insert with check (true);

create policy "products_update" on public.products
  for update using (true) with check (true);

create policy "products_delete" on public.products
  for delete using (true);

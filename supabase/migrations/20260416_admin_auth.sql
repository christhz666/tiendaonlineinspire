-- ============================================================
-- ADMIN AUTH MIGRATION — Supabase Auth + username allowlist
-- ============================================================
-- Login con USUARIO (no email). Internamente Supabase usa un
-- email dummy (ej: "cristopher@inspire-admin.local") que vos
-- nunca ves desde la UI.
--
-- ORDEN PARA LA PRIMERA VEZ:
--   1. Supabase Dashboard → Authentication → Users → "Add user"
--      Email:   cristopher@inspire-admin.local   (interno, ponele cualquiera único)
--      Password: la que quieras usar para loguearte
--      Auto Confirm User: ✓  (IMPORTANTE)
--   2. SQL Editor → pegar TODO este archivo → RUN
--   3. SQL Editor → ajustar paso 7 con tu username y el email que usaste arriba
--   4. Authentication → Providers → Email → "Enable Signups" = OFF
--      (para que nadie más pueda registrarse)
-- ============================================================

-- 1. Tabla allowlist de administradores (con username)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Si la tabla ya existía con columna email, migrar a username
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE public.admin_users DROP COLUMN IF EXISTS email;

-- Unique constraint + not null sobre username (idempotente)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'admin_users_username_key'
  ) THEN
    ALTER TABLE public.admin_users ADD CONSTRAINT admin_users_username_key UNIQUE (username);
  END IF;
END $$;

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 2. Helper: is_admin() para usar desde policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  );
$$;

-- 3. RPC: username → email (permite loguearse por usuario)
-- SECURITY DEFINER le permite leer auth.users que normalmente anon no puede.
CREATE OR REPLACE FUNCTION public.get_admin_email_by_username(p_username text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT u.email
  FROM auth.users u
  INNER JOIN public.admin_users a ON a.id = u.id
  WHERE lower(a.username) = lower(p_username)
  LIMIT 1;
$$;

-- Permitir que anon + authenticated llamen la función
GRANT EXECUTE ON FUNCTION public.get_admin_email_by_username(text) TO anon, authenticated;

-- 4. Policies sobre admin_users: solo admins ven la tabla completa.
--    (El cliente usa .select('id, username').eq('id', auth.uid()) — la policy cubre ese caso)
DROP POLICY IF EXISTS "admin_read_admins" ON public.admin_users;
CREATE POLICY "admin_read_admins"
ON public.admin_users
FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.is_admin());

-- 4. Limpiar policies previas en affiliate_config y products
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname, tablename FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('affiliate_config', 'products')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

ALTER TABLE public.affiliate_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 5. SELECT público: anónimos pueden ver catálogo y config de afiliado
CREATE POLICY "public_read_affiliate_config"
ON public.affiliate_config FOR SELECT TO public USING (true);

CREATE POLICY "public_read_products"
ON public.products FOR SELECT TO public USING (true);

-- 6. WRITES: solo admins autenticados (split por operación — mejor performance que FOR ALL)
CREATE POLICY "admin_insert_affiliate_config"
ON public.affiliate_config FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "admin_update_affiliate_config"
ON public.affiliate_config FOR UPDATE TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admin_delete_affiliate_config"
ON public.affiliate_config FOR DELETE TO authenticated
USING (public.is_admin());

CREATE POLICY "admin_insert_products"
ON public.products FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "admin_update_products"
ON public.products FOR UPDATE TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admin_delete_products"
ON public.products FOR DELETE TO authenticated
USING (public.is_admin());

-- 7. Registrar el admin real
--    NOTA: antes de correr este bloque, creá el user en Dashboard:
--      Authentication → Users → Add user
--      Email: cristianroca4@inspire-admin.local
--      Password: cristopher7
--      Auto Confirm User: ✓
DO $$
DECLARE
  target_email text := 'cristianroca4@inspire-admin.local';
  target_username text := 'cristianroca4';
  existing_user record;
BEGIN
  SELECT id, email INTO existing_user FROM auth.users WHERE email = target_email;

  IF existing_user IS NULL THEN
    RAISE NOTICE '⚠ No existe user con email % en auth.users.', target_email;
    RAISE NOTICE '   Creá el user en Authentication → Users → Add user y volvé a correr SOLO este paso 7.';
  ELSE
    INSERT INTO public.admin_users (id, username)
    VALUES (existing_user.id, target_username)
    ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username;
    RAISE NOTICE '✓ Admin registrado: username=%  id=%  email=%', target_username, existing_user.id, existing_user.email;
  END IF;
END $$;

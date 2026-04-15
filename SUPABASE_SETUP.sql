-- SQL para crear las tablas necesarias en Supabase
-- Ejecuta esto en el SQL Editor de tu Dashboard de Supabase

-- 1. Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    handle TEXT NOT NULL,
    description TEXT,
    description_html TEXT,
    vendor TEXT,
    product_type TEXT,
    tags JSONB DEFAULT '[]',
    status TEXT DEFAULT 'published',
    images JSONB DEFAULT '[]',
    thumbnail TEXT,
    variants JSONB DEFAULT '[]',
    options JSONB DEFAULT '[]',
    price_range JSONB,
    compare_at_price BIGINT,
    features JSONB DEFAULT '[]',
    shipping_info JSONB DEFAULT '[]',
    badges JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Órdenes
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    date TIMESTAMPTZ DEFAULT NOW(),
    items JSONB NOT NULL,
    total BIGINT NOT NULL,
    customer JSONB NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Habilitar RLS (Seguridad por Filas)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Acceso para Productos (Lectura pública)
CREATE POLICY "Permitir lectura pública de productos" 
ON products FOR SELECT 
TO anon 
USING (true);

CREATE POLICY "Permitir gestión total a administradores" 
ON products FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);

-- 5. Políticas de Acceso para Órdenes
CREATE POLICY "Permitir inserción de órdenes" 
ON orders FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Permitir lectura de órdenes" 
ON orders FOR SELECT 
TO anon 
USING (true);

-- Nota: Para producción real, deberías restringir las políticas de gestión (INSERT/UPDATE/DELETE) 
-- a usuarios autenticados o con roles específicos, pero para desarrollo local con Anon Key 
-- esto funcionará.

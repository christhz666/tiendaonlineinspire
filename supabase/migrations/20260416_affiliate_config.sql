-- Affiliate Config table
-- Stores the affiliate profile information (sponsor link, ref code, contact info)
-- Only ONE row is needed (id = 'default')

create table if not exists affiliate_config (
  id text primary key default 'default',
  sponsor_url text not null,
  ref_code text not null,
  affiliate_name text,
  whatsapp_number text,
  office_url text,
  tagline text,
  updated_at timestamptz default now()
);

-- RLS: public read, public write (since we rely on app-level admin password)
alter table affiliate_config enable row level security;

drop policy if exists "public read affiliate_config" on affiliate_config;
create policy "public read affiliate_config"
  on affiliate_config for select
  using (true);

drop policy if exists "public write affiliate_config" on affiliate_config;
create policy "public write affiliate_config"
  on affiliate_config for all
  using (true)
  with check (true);

-- Seed initial row (idempotent)
insert into affiliate_config (id, sponsor_url, ref_code, affiliate_name, whatsapp_number, tagline)
values (
  'default',
  'https://www.oficina.rd.inspiretienda.com/register?ref=MKnDDs9iRvaAd&p=232916',
  '11048224.MKnDDs9iRvaAd',
  'Cristopher',
  '+18095550123',
  'Tu socio en el camino al bienestar y la libertad financiera'
)
on conflict (id) do nothing;

-- WallDecor99 core PostgreSQL schema for Supabase
-- Apply with Supabase CLI after reviewing business-specific GST, status and retention rules.

create extension if not exists pgcrypto;

create type public.product_type as enum ('ready_roll', 'custom_wallpaper', 'sample', 'service');
create type public.order_status as enum ('draft','awaiting_payment','payment_pending','payment_confirmed','design_review_required','customer_approval_required','approved_for_printing','in_production','quality_check','ready_for_dispatch','shipped','out_for_delivery','delivered','installation_scheduled','installation_completed','cancelled','refunded','partially_refunded');
create type public.payment_status as enum ('pending','authorized','captured','failed','refunded','partially_refunded');
create type public.quotation_status as enum ('draft','sent','confirmed','expired','converted_to_order','cancelled');
create type public.design_status as enum ('draft','quality_warning','designer_review','proof_ready','customer_approval','approved','print_ready','archived');
create type public.installation_status as enum ('requested','area_verification_required','assigned','scheduled','in_progress','completed','cancelled','revisit_required');

create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  preferred_language text not null default 'en',
  marketing_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  primary key (user_id, role_id)
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country_code char(2) not null default 'IN',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index addresses_user_id_idx on public.addresses(user_id);
create index addresses_postal_code_idx on public.addresses(postal_code);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  kind text not null default 'product',
  description text,
  image_path text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index categories_parent_id_idx on public.categories(parent_id);
create index categories_kind_active_idx on public.categories(kind, is_active);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_path text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.materials (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  price_per_sqft numeric(12,2) not null check (price_per_sqft >= 0),
  minimum_order_sqft numeric(12,2) not null default 50 check (minimum_order_sqft > 0),
  finish text,
  thickness_mm numeric(8,3),
  weight_gsm numeric(8,2),
  washability text,
  moisture_resistance integer check (moisture_resistance between 1 and 5),
  scratch_resistance integer check (scratch_resistance between 1 and 5),
  durability_rating integer check (durability_rating between 1 and 5),
  expected_life_years integer,
  recommended_rooms text[] not null default '{}',
  recommended_wall_conditions text,
  installation_method text,
  warranty_text text,
  sample_available boolean not null default false,
  texture_image_path text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index materials_active_idx on public.materials(is_active);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  type public.product_type not null,
  name text not null,
  slug text not null unique,
  sku text not null unique,
  short_description text,
  description text,
  material_id uuid references public.materials(id) on delete set null,
  base_price numeric(12,2) not null check (base_price >= 0),
  compare_at_price numeric(12,2),
  roll_width_ft numeric(8,3),
  roll_length_ft numeric(8,3),
  pattern_repeat_in numeric(8,2) not null default 0,
  pattern_name text,
  colour_name text,
  style_names text[] not null default '{}',
  room_names text[] not null default '{}',
  washability text,
  durability_rating integer check (durability_rating between 1 and 5),
  care_instructions text,
  warranty_text text,
  installation_available boolean not null default true,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  status text not null default 'draft' check (status in ('draft','active','archived')),
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index products_status_type_idx on public.products(status, type);
create index products_material_id_idx on public.products(material_id);
create index products_search_idx on public.products using gin (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(sku,'') || ' ' || coalesce(description,'')));

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  kind text not null check (kind in ('original','thumbnail','catalogue','detail','zoom','room','texture','video_poster')),
  storage_path text not null,
  alt_text text,
  width_px integer,
  height_px integer,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);
create index product_images_product_idx on public.product_images(product_id, sort_order);

create table public.product_categories (
  product_id uuid not null references public.products(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);

create table public.product_collections (
  product_id uuid not null references public.products(id) on delete cascade,
  collection_id uuid not null references public.collections(id) on delete cascade,
  primary key (product_id, collection_id)
);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  delta integer not null,
  reason text not null,
  reference_type text,
  reference_id uuid,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index inventory_movements_product_idx on public.inventory_movements(product_id, created_at desc);

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  thumbnail_path text not null,
  source_path text not null,
  aspect_ratio_min numeric(8,4),
  aspect_ratio_max numeric(8,4),
  editable_schema jsonb not null default '{}'::jsonb,
  tags text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customer_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  guest_token uuid,
  original_filename text not null,
  mime_type text not null,
  file_size_bytes bigint not null,
  width_px integer,
  height_px integer,
  storage_path text not null,
  checksum_sha256 text,
  copyright_confirmed boolean not null default false,
  retention_until timestamptz,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (user_id is not null or guest_token is not null)
);
create index customer_uploads_user_idx on public.customer_uploads(user_id, created_at desc);

create table public.designs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  guest_token uuid,
  title text not null,
  design_type text not null,
  template_id uuid references public.templates(id) on delete set null,
  width_ft numeric(10,3) not null check (width_ft > 0),
  height_ft numeric(10,3) not null check (height_ft > 0),
  excluded_area_sqft numeric(12,2) not null default 0,
  material_id uuid references public.materials(id) on delete set null,
  status public.design_status not null default 'draft',
  preview_path text,
  pricing_snapshot jsonb,
  customer_notes text,
  low_resolution_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (user_id is not null or guest_token is not null)
);
create index designs_user_status_idx on public.designs(user_id, status);

create table public.design_versions (
  id uuid primary key default gen_random_uuid(),
  design_id uuid not null references public.designs(id) on delete cascade,
  version_number integer not null,
  canvas_json jsonb not null,
  preview_path text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(design_id, version_number)
);

create table public.design_assets (
  design_id uuid not null references public.designs(id) on delete cascade,
  upload_id uuid not null references public.customer_uploads(id) on delete restrict,
  role text not null default 'image',
  primary key (design_id, upload_id)
);

create table public.image_quality_checks (
  id uuid primary key default gen_random_uuid(),
  upload_id uuid not null references public.customer_uploads(id) on delete cascade,
  design_id uuid references public.designs(id) on delete cascade,
  target_width_ft numeric(10,3) not null,
  target_height_ft numeric(10,3) not null,
  effective_dpi numeric(10,2) not null,
  quality_label text not null,
  maximum_recommended_width_ft numeric(10,3),
  maximum_recommended_height_ft numeric(10,3),
  warning_text text,
  created_at timestamptz not null default now()
);

create table public.calculator_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  guest_token uuid,
  product_id uuid references public.products(id) on delete set null,
  input_snapshot jsonb not null,
  result_snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create table public.room_visualizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  guest_token uuid,
  room_upload_id uuid not null references public.customer_uploads(id) on delete restrict,
  product_id uuid references public.products(id) on delete set null,
  wall_polygon jsonb not null,
  transform_settings jsonb not null default '{}'::jsonb,
  preview_path text,
  share_token uuid unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  guest_token uuid,
  currency char(3) not null default 'INR',
  recovered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (user_id is not null or guest_token is not null)
);
create unique index one_open_cart_per_user on public.carts(user_id) where user_id is not null;

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid references public.products(id) on delete restrict,
  design_id uuid references public.designs(id) on delete restrict,
  item_type public.product_type not null,
  title text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  pricing_snapshot jsonb not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (product_id is not null or design_id is not null or item_type = 'service')
);
create index cart_items_cart_idx on public.cart_items(cart_id);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percent','fixed')),
  discount_value numeric(12,2) not null check (discount_value > 0),
  minimum_order numeric(12,2) not null default 0,
  maximum_discount numeric(12,2),
  usage_limit integer,
  per_user_limit integer,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  guest_email text,
  guest_phone text,
  status public.order_status not null default 'draft',
  payment_status public.payment_status not null default 'pending',
  currency char(3) not null default 'INR',
  shipping_address jsonb not null,
  billing_address jsonb,
  pricing_snapshot jsonb not null,
  subtotal numeric(12,2) not null,
  discount_total numeric(12,2) not null default 0,
  delivery_total numeric(12,2) not null default 0,
  installation_total numeric(12,2) not null default 0,
  tax_total numeric(12,2) not null default 0,
  grand_total numeric(12,2) not null,
  customer_notes text,
  placed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_user_created_idx on public.orders(user_id, created_at desc);
create index orders_status_created_idx on public.orders(status, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  design_id uuid references public.designs(id) on delete set null,
  item_type public.product_type not null,
  title text not null,
  sku text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null,
  tax_rate numeric(6,3) not null default 18,
  pricing_snapshot jsonb not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index order_items_order_idx on public.order_items(order_id);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  old_status public.order_status,
  new_status public.order_status not null,
  note text,
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  provider text not null,
  provider_order_id text,
  provider_payment_id text,
  status public.payment_status not null default 'pending',
  amount numeric(12,2) not null,
  currency char(3) not null default 'INR',
  method text,
  raw_response jsonb,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index payments_provider_payment_unique on public.payments(provider, provider_payment_id) where provider_payment_id is not null;

create table public.quotations (
  id uuid primary key default gen_random_uuid(),
  quotation_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  customer_snapshot jsonb not null,
  status public.quotation_status not null default 'draft',
  pricing_snapshot jsonb not null,
  subtotal numeric(12,2) not null,
  discount_total numeric(12,2) not null default 0,
  tax_total numeric(12,2) not null default 0,
  grand_total numeric(12,2) not null,
  terms_snapshot text,
  pdf_path text,
  valid_until date,
  order_id uuid references public.orders(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index quotations_status_validity_idx on public.quotations(status, valid_until);

create table public.quotation_items (
  id uuid primary key default gen_random_uuid(),
  quotation_id uuid not null references public.quotations(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  design_id uuid references public.designs(id) on delete set null,
  description text not null,
  quantity numeric(12,3) not null,
  unit text not null,
  rate numeric(12,2) not null,
  amount numeric(12,2) not null,
  metadata jsonb not null default '{}'::jsonb
);

create table public.service_areas (
  id uuid primary key default gen_random_uuid(),
  postal_code text not null unique,
  city text not null,
  state text not null,
  delivery_available boolean not null default true,
  installation_available boolean not null default false,
  installation_rate_sqft numeric(12,2),
  base_visit_charge numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.installation_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  address_snapshot jsonb not null,
  wall_details jsonb not null,
  wall_condition text,
  existing_wallpaper boolean,
  dampness_reported boolean,
  preferred_date date,
  special_instructions text,
  status public.installation_status not null default 'requested',
  assigned_installer_id uuid,
  price_snapshot jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  order_item_id uuid references public.order_items(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  is_verified boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reviews_product_published_idx on public.reviews(product_id, is_published, created_at desc);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  channel text not null check (channel in ('website','whatsapp','phone','email')),
  kind text not null,
  customer_name text,
  phone text,
  email text,
  product_id uuid references public.products(id) on delete set null,
  design_id uuid references public.designs(id) on delete set null,
  quotation_id uuid references public.quotations(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'new',
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);
create index audit_logs_entity_idx on public.audit_logs(entity_type, entity_id, created_at desc);

-- Automatic updated_at helper
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

do $$ declare t text; begin
  foreach t in array array['user_profiles','addresses','categories','collections','materials','products','templates','designs','room_visualizations','carts','cart_items','orders','payments','quotations','service_areas','installation_requests','reviews','enquiries']
  loop execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_set_updated_at', t); end loop;
end $$;

-- Seed roles
insert into public.roles (code, name) values
('super_admin','Super Admin'),('product_manager','Product Manager'),('order_manager','Order Manager'),('designer','Designer'),('sales_executive','Sales Executive'),('customer_support','Customer Support'),('installer','Installer'),('accountant','Accountant'),('customer','Customer')
on conflict (code) do nothing;

-- Public catalogue RLS; private/customer data remains owner scoped.
alter table public.user_profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.materials enable row level security;
alter table public.templates enable row level security;
alter table public.customer_uploads enable row level security;
alter table public.designs enable row level security;
alter table public.design_versions enable row level security;
alter table public.room_visualizations enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.quotations enable row level security;
alter table public.reviews enable row level security;

create policy "public read active products" on public.products for select using (status = 'active' and deleted_at is null);
create policy "public read product images" on public.product_images for select using (exists (select 1 from public.products p where p.id = product_id and p.status = 'active' and p.deleted_at is null));
create policy "public read active categories" on public.categories for select using (is_active and deleted_at is null);
create policy "public read active collections" on public.collections for select using (is_active);
create policy "public read active materials" on public.materials for select using (is_active and deleted_at is null);
create policy "public read active templates" on public.templates for select using (is_active);
create policy "public read published reviews" on public.reviews for select using (is_published);

create policy "profile owner read" on public.user_profiles for select using (auth.uid() = id);
create policy "profile owner update" on public.user_profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "address owner all" on public.addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "upload owner read" on public.customer_uploads for select using (auth.uid() = user_id);
create policy "upload owner insert" on public.customer_uploads for insert with check (auth.uid() = user_id);
create policy "design owner all" on public.designs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "design version owner read" on public.design_versions for select using (exists (select 1 from public.designs d where d.id = design_id and d.user_id = auth.uid()));
create policy "visualization owner all" on public.room_visualizations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "cart owner all" on public.carts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "cart item owner all" on public.cart_items for all using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid())) with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));
create policy "order owner read" on public.orders for select using (auth.uid() = user_id);
create policy "order item owner read" on public.order_items for select using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "quotation owner read" on public.quotations for select using (auth.uid() = user_id);

-- Storage buckets should be created separately:
-- product-images (public), template-assets (public), customer-uploads (private), generated-previews (private), documents (private).

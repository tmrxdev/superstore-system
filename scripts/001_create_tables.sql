-- Users table for shop staff (managed by superadmin)
create table if not exists public.shop_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  role text not null default 'staff' check (role in ('superadmin', 'staff')),
  created_at timestamp with time zone default now(),
  created_by uuid references public.shop_users(id)
);

-- Inventory table for minecraft items
create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  item_name text unique not null,
  item_id text not null,
  image_url text,
  price decimal(10, 2) not null,
  stock integer not null default 0,
  eligible_for_auto_discount boolean default false,
  discount_percentage integer default 0 check (discount_percentage >= 0 and discount_percentage <= 100),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Daily deals table (generated daily)
create table if not exists public.daily_deals (
  id uuid primary key default gen_random_uuid(),
  inventory_id uuid references public.inventory(id) on delete cascade,
  discount_percentage integer not null check (discount_percentage >= 5 and discount_percentage <= 25),
  deal_date date not null default current_date,
  created_at timestamp with time zone default now(),
  unique(inventory_id, deal_date)
);

-- Create indexes for better performance
create index if not exists idx_inventory_item_name on public.inventory(item_name);
create index if not exists idx_inventory_eligible_discount on public.inventory(eligible_for_auto_discount);
create index if not exists idx_daily_deals_date on public.daily_deals(deal_date);

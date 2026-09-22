alter table public.products
  add column if not exists free_delivery boolean not null default false,
  add column if not exists max_per_order integer,
  add column if not exists show_stock_quantity boolean not null default false,
  add column if not exists show_limited_availability boolean not null default false;

update public.products
set max_per_order = 1
where max_per_order is null;

alter table public.products
  add constraint products_max_per_order_check
  check (max_per_order is null or max_per_order >= 1);

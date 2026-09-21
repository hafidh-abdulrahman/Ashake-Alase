# Ashake Alase: Phase 1 frontend

React + Vite + TypeScript + Tailwind CSS v4 + React Router + Lucide.
Runs entirely on mock data. Nothing needs a backend to demo the full ordering flow.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
```

Copy `.env.example` to `.env` to change bank and contact details.

## Routes

| Route | Page |
|-------|------|
| `/` | Homepage |
| `/menu` (`?category=combo\|catering\|food\|event`) | Menu / Offers |
| `/menu/:id` | Product details + quantity |
| `/cart` | Order summary |
| `/checkout` | Delivery details |
| `/payment` | Bank transfer + receipt upload |
| `/order/:orderNumber` | Order confirmation |
| `/contact` | Contact |
| `/admin` | Dashboard + orders list |
| `/admin/orders/:orderId` | Order details + status changes |

## Structure

```
src/
  types/          Product, Order, OrderItem, DeliveryArea, Payment, OrderStatus ...
  config/site.ts  Brand name, navigation, bank + contact details (from env)
  data/mock/      products, deliveryAreas, orders (seed), content (copy, gallery, media)
  services/       The only place data is read or written. Swap for Supabase in Phase 2.
  lib/            format, validation, order helpers, supabase client stub, storage helpers
  context/        CartContext (cart, checkout draft, receipt file)
  hooks/          useAsync + data hooks used by pages
  components/     ui/ layout/ home/ order/ admin/
  pages/          Storefront pages, pages/admin/ for the admin
  styles/index.css  Brand tokens (colours, fonts) in one @theme block
public/
  logo.png, favicon.png
  images/         Drop real photos here (see images/README.md)
```

## Rebranding
Colours and fonts live in `src/styles/index.css` under `@theme`. Change the token values and the whole site follows.

## Phase 2 checklist (Supabase)
1. Create tables: `products`, `delivery_areas`, `orders`, `order_items`, `payments` (field names match `src/types`).
2. Create a private Storage bucket for payment receipts.
3. Rewrite the functions in `src/services/*` to call Supabase. Signatures stay the same, so no component changes.
4. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `src/lib/supabase.ts`).
5. Add Supabase Auth and enforce it in `src/components/admin/AdminGuard.tsx`, plus row level security so only admins can list or update orders.
6. Create orders through a database function (RPC) so prices and delivery fees are calculated on the server, never trusted from the browser.
7. Remove `simulateLatency` in `src/services/delay.ts` and the demo reset in the admin dashboard.
8. Optional: Paystack or Flutterwave. Add the initialise/verify calls in `src/services/paymentService.ts` and set `payment.method` accordingly.

## Demo behaviour to know about
- Orders placed in the browser are saved to `localStorage`, so they appear in `/admin` on the same device.
- The admin has no login yet.
- The cart and checkout draft persist across refreshes.

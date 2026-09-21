import {
  Home,
  ShoppingBag,
  UtensilsCrossed,
  ClipboardList,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { navLinks, site } from "@/config/site";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

function useIsActive() {
  const { pathname } = useLocation();
  return (to: string) => {
    if (to === "/") return pathname === "/";
    return pathname.startsWith(to);
  };
}

export function Header() {
  const { itemCount } = useCart();
  const location = useLocation();
  const isActive = useIsActive();
  const isHome = location.pathname === "/";

  const mobileNavItems = [
    { label: "Home", to: "/", icon: Home },
    { label: "Menu", to: "/menu", icon: UtensilsCrossed },
    { label: "Orders", to: "/track", icon: ClipboardList },
    { label: "Cart", to: "/cart", icon: ShoppingBag },
  ] as const;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 transition-shadow">
        <div className="container-page max-w-[80rem] pt-4 md:pt-5">
          <div className="flex h-[4.5rem] items-center justify-between gap-6 rounded-full border border-white/55 bg-white/60 px-5 shadow-lg backdrop-blur-lg md:h-[4.75rem]">
            <Link
              to="/"
              aria-label={`${site.name} home`}
              className="group flex shrink-0 items-center gap-2"
            >
              <img
                src={site.logo}
                alt={site.name}
                width={48}
                height={48}
                className="size-11 object-contain transition-transform group-hover:rotate-2 md:size-12"
              />
            </Link>

            <nav
              aria-label="Main"
              className="hidden items-center gap-1 md:flex"
            >
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  aria-current={isActive(l.to) ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-[0.95rem] font-medium text-ink-soft transition-colors hover:text-ink",
                    isActive(l.to) && "font-bold text-ink",
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <Link
                to="/cart"
                aria-label={
                  itemCount ? `Your order, ${itemCount} items` : "Your order"
                }
                className="relative grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 md:hidden"
              >
                <ShoppingBag className="size-[1.4rem]" />
                {itemCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[0.7rem] font-bold leading-5 text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
              <span className="hidden md:inline-block">
                <Button to="/menu" size="sm">
                  Order Now
                </Button>
              </span>
            </div>
          </div>
        </div>
      </header>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-3 z-40 px-3 md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-2 rounded-[1.5rem] border border-ink/10 bg-white/90 p-2 shadow-[0_10px_30px_rgba(36,25,22,0.12)] backdrop-blur-lg">
          {mobileNavItems.map(({ label, to, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={label}
                to={to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 rounded-[1rem] px-2 py-2.5 text-[0.68rem] font-semibold transition-colors",
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "text-ink-soft hover:bg-surface-alt/70 hover:text-ink",
                )}
              >
                <span className="relative grid place-items-center">
                  <Icon className="size-[1.15rem]" aria-hidden />
                  {label === "Cart" && itemCount > 0 && (
                    <span className="absolute -right-2.5 -top-2 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[0.55rem] font-bold leading-4 text-ink">
                      {itemCount}
                    </span>
                  )}
                </span>
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {!isHome && (
        <div aria-hidden className="h-[6rem] shrink-0 md:h-[6.75rem]" />
      )}
    </>
  );
}

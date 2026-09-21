import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();
  const isActive = useIsActive();
  const isHome = location.pathname === "/";

  useEffect(() => setOpen(false), [location.pathname, location.hash]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

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
                className="relative grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5"
              >
                <ShoppingBag className="size-[1.4rem]" />
                {itemCount > 0 && (
                  <span className="absolute right-0.5 top-0.5 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[0.7rem] font-bold leading-5 text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
              <span className={open ? "max-md:hidden" : undefined}>
                <Button to="/menu" size="sm">
                  Order Now
                </Button>
              </span>
              <button
                type="button"
                className="grid size-11 place-items-center rounded-full text-ink hover:bg-ink/5 md:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
              >
                {open ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>
        </div>

        {open && (
          <div
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 top-[5.5rem] z-30 flex flex-col bg-surface px-5 pb-8 pt-4 md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-1 flex-col">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className={cn(
                    "border-b border-line py-4 font-display text-3xl font-bold tracking-tight",
                    isActive(l.to) ? "font-extrabold text-primary" : "text-ink",
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <Button to="/menu" size="lg" full>
              Order Now
            </Button>
          </div>
        )}
      </header>
      {!isHome && (
        <div aria-hidden className="h-[6rem] shrink-0 md:h-[6.75rem]" />
      )}
    </>
  );
}

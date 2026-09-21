import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import logo from "../assets/logo.png";
import { useCart } from "../context/CartContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Offers" },
  { to: "/menu", label: "Menu" },
  { to: "/contact", label: "Contact" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();
  const solid = scrolled || location.pathname !== "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid
          ? "bg-charcoal/95 backdrop-blur shadow-[0_1px_0_rgba(255,255,255,0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-wide flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Ashake Alase"
            className="h-12 w-12 rounded-full object-cover"
          />
          <span className="font-display text-xl font-semibold text-cream">
            Ashake Alase
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links
            .filter(
              (l, i, arr) => arr.findIndex((x) => x.label === l.label) === i,
            )
            .map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wide text-cream/80 transition hover:text-gold-light ${
                    isActive ? "text-gold-light" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 text-cream transition hover:border-gold-light hover:text-gold-light"
            aria-label="View cart"
          >
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ember text-[11px] font-bold text-cream">
                {itemCount}
              </span>
            )}
          </Link>
          <Link
            to="/menu"
            className="hidden rounded-full bg-ember px-5 py-2.5 text-sm font-semibold tracking-wide text-cream shadow-card transition hover:bg-ember-light sm:inline-block"
          >
            Order Now
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-cream md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-cream/10 bg-charcoal px-5 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {links
              .filter(
                (l, i, arr) => arr.findIndex((x) => x.label === l.label) === i,
              )
              .map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="rounded-lg px-3 py-3 text-cream/90"
                >
                  {link.label}
                </Link>
              ))}
            <Link
              to="/menu"
              className="mt-2 rounded-full bg-ember px-4 py-3 text-center font-semibold text-cream"
            >
              Order Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

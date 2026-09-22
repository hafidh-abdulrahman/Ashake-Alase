import { Link, Outlet, useNavigate } from "react-router-dom";
import { ExternalLink, MapPin, Package } from "lucide-react";
import { site } from "@/config/site";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { ScrollManager } from "./ScrollManager";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function AdminLayout() {
  const navigate = useNavigate();

  const logout = async () => {
    await supabase?.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <AdminGuard>
      <div className="min-h-dvh bg-surface">
        <ScrollManager />
        <header className="border-b border-line bg-paper">
          <div className="container-page flex flex-col gap-3 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:py-0">
            <Link to="/admin" className="flex items-center gap-3">
              <img
                src={site.logo}
                alt=""
                width={40}
                height={40}
                className="size-10"
              />
              <span className="font-display text-lg font-bold">
                Orders admin
              </span>
            </Link>
            <nav
              aria-label="Admin navigation"
              className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-3 text-sm sm:border-0 sm:pt-0"
            >
              <Link
                to="/admin/menu"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
              >
                <Package className="size-4" aria-hidden /> Menu items
              </Link>
              <Link
                to="/admin/delivery"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
              >
                <MapPin className="size-4" aria-hidden /> Delivery
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
              >
                View website <ExternalLink className="size-4" aria-hidden />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
              >
                <LogOut className="size-4" aria-hidden /> Logout
              </button>
            </nav>
          </div>
        </header>
        <main className="container-page py-8 lg:py-12">
          <Outlet />
        </main>
      </div>
    </AdminGuard>
  );
}

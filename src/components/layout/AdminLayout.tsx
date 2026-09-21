import { Link, Outlet } from "react-router-dom";
import { ExternalLink, MapPin, Package } from "lucide-react";
import { site } from "@/config/site";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { ScrollManager } from "./ScrollManager";

export function AdminLayout() {
  return (
    <AdminGuard>
      <div className="min-h-dvh bg-surface">
        <ScrollManager />
        <header className="border-b border-line bg-paper">
          <div className="container-page flex h-16 items-center justify-between">
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
            <div className="flex items-center gap-4">
              <Link
                to="/admin/menu"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
              >
                <Package className="size-4" aria-hidden /> Menu items
              </Link>
              <Link
                to="/admin/delivery"
                className="hidden items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink sm:inline-flex"
              >
                <MapPin className="size-4" aria-hidden /> Delivery
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink"
              >
                View website <ExternalLink className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </header>
        <main className="container-page py-8 lg:py-12">
          <Outlet />
        </main>
      </div>
    </AdminGuard>
  );
}

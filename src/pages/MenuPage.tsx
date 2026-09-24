import { Link, useSearchParams } from "react-router-dom";
import type { ProductCategory } from "@/types";
import { useProducts } from "@/hooks/useData";
import { categoryLabels } from "@/data/mock/content";
import { ProductCard } from "@/components/order/ProductCard";
import { LoadingBlock } from "@/components/ui/PageState";
import { cn } from "@/lib/cn";
import { Seo } from "@/components/Seo";

const categories = Object.keys(categoryLabels) as ProductCategory[];

export default function MenuPage() {
  const [params, setParams] = useSearchParams();
  const raw = params.get("category");
  const category = categories.includes(raw as ProductCategory)
    ? (raw as ProductCategory)
    : undefined;
  const { data: products, loading, error } = useProducts(category);

  const chip = (active: boolean) =>
    cn(
      "whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition-colors",
      active
        ? "border-primary bg-primary text-white"
        : "border-line bg-paper text-ink-soft hover:border-primary hover:text-primary",
    );

  return (
    <div className="pb-20 lg:pb-28">
      <Seo
        title="Menu and Food Offers | Ashake Alase"
        description="Browse Ashake Alase meals, party trays, catering options and special food packages available to order online."
        path="/menu"
      />
      <section className="bg-ink text-surface">
        <div className="container-page grid gap-8 py-14 md:grid-cols-[1fr_auto] md:items-end md:py-20">
          <div>
            <p className="eyebrow text-accent">Our specialties</p>
            <h1 className="mt-3 max-w-3xl text-[clamp(3rem,8vw,6.5rem)] text-surface">
              The feast list.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-surface/70">
              Fresh meals, party trays and special packages made to order. Pick
              your plate and we’ll handle the rest.
            </p>
          </div>
          <Link
            to="/#featured"
            className="inline-flex items-center gap-2 font-bold text-accent hover:text-white"
          >
            See October special <span aria-hidden>↗</span>
          </Link>
        </div>
      </section>

      <div
        className="container-page -mt-5 relative z-10 flex gap-2 overflow-x-auto pb-2"
        role="group"
        aria-label="Filter by type"
      >
        <button
          type="button"
          className={chip(!category)}
          aria-pressed={!category}
          onClick={() => setParams({})}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={chip(category === c)}
            aria-pressed={category === c}
            onClick={() => setParams({ category: c })}
          >
            {categoryLabels[c]}
          </button>
        ))}
      </div>

      {loading && <LoadingBlock label="Loading the menu" />}
      {error && <p className="mt-10 text-bad">{error}</p>}
      {!loading && products && products.length === 0 && (
        <div className="mt-12 rounded-3xl border border-dashed border-line p-10 text-center">
          <p className="text-lg font-semibold">
            Nothing available in this category right now.
          </p>
          <button
            type="button"
            className="mt-3 font-semibold text-primary underline underline-offset-4"
            onClick={() => setParams({})}
          >
            Show everything
          </button>
        </div>
      )}
      {!loading && products && products.length > 0 && (
        <div className="container-page mt-8 grid grid-cols-2 gap-3 max-[380px]:grid-cols-1 sm:mt-10 sm:gap-5 lg:mt-16 lg:grid-cols-3 lg:gap-7">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

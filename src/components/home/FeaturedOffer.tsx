import { Button } from "@/components/ui/Button";
import { FoodImage } from "@/components/ui/FoodImage";
import { useFeaturedProduct } from "@/hooks/useData";
import { formatNaira, formatDate } from "@/lib/format";

export function FeaturedOffer() {
  const { data: p } = useFeaturedProduct();
  if (!p) return <div id="featured" />;

  const preview = p.includes.slice(0, 3).join(", ").toLowerCase();

  return (
    <section id="featured" className="scroll-mt-16 bg-primary text-white">
      <div className="container-page section-y grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="relative order-2 mx-auto w-full max-w-xl lg:order-1">
          <span className="eyebrow absolute left-4 top-4 z-10 rounded-full bg-accent px-4 py-2 text-ink shadow-lift">
            Ashake exclusive
          </span>
          <FoodImage
            src={p.image}
            alt={p.name}
            placeholder={p.placeholder}
            className="aspect-4/3 w-full rounded-4xl shadow-2xl lg:aspect-5/4"
          />
        </div>

        <div className="order-1 lg:order-2">
          <p className="eyebrow text-white/60">Ashake / October 1st</p>
          <h2 className="mt-4 text-[clamp(3rem,7vw,6.2rem)] text-white">
            The special combo
          </h2>
          <p className="mt-5 max-w-lg text-lg text-white/80">
            {p.summary} Includes {preview} and more.
          </p>

          <dl className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-5 border-y border-white/25 py-6">
            <div>
              <dt className="text-sm text-white/60">Price per pack</dt>
              <dd className="font-display text-4xl font-extrabold tracking-tight">
                {formatNaira(p.price)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-white/60">Availability</dt>
              <dd className="text-lg font-semibold">
                {p.availableQuantity != null
                  ? `${p.availableQuantity} packs left`
                  : "Available now"}
              </dd>
            </div>
            {p.campaign?.endsAt && (
              <div>
                <dt className="text-sm text-white/60">Orders close</dt>
                <dd className="text-lg font-semibold">
                  {formatDate(p.campaign.endsAt)}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-8">
            <Button to={`/menu/${p.id}`} size="lg">
              {p.category === "combo" ? "Order This Combo" : "Order This Offer"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

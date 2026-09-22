import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { FoodImage } from "@/components/ui/FoodImage";
import { heroContent } from "@/data/mock/content";
import { useFeaturedProduct } from "@/hooks/useData";
import { site } from "@/config/site";

export function Hero() {
  const { data: featured } = useFeaturedProduct();
  const campaign = featured?.campaign;
  const isLimited = featured?.availableQuantity != null;

  return (
    <section className="relative overflow-hidden bg-surface text-ink">
      <div className="container-page relative grid min-h-[min(58rem,100svh)] items-center gap-12 pb-16 pt-32 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pb-20 lg:pt-36">
        <div className="relative z-10 mx-auto w-full max-w-lg">
          <div className="mb-6 flex items-center gap-4 animate-rise">
            <img
              src={site.logo}
              alt=""
              width={68}
              height={68}
              className="size-14 object-contain md:size-16"
            />
            <p className="eyebrow text-primary">Ashake Alase</p>
          </div>
          <h1 className="max-w-lg font-serif text-[clamp(3rem,5.5vw,5.5rem)] leading-[0.88] tracking-[-0.055em] text-ink">
            {heroContent.headline.map((line, i) => (
              <span
                key={line}
                className="block animate-rise"
                style={{ animationDelay: `${i * 110}ms` }}
              >
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-7 max-w-md animate-rise text-base text-ink-soft [animation-delay:260ms] md:text-lg">
            {heroContent.supporting}
          </p>
          <div className="mt-8 flex animate-rise flex-wrap gap-3 [animation-delay:380ms]">
            <Button to="/menu" size="lg">
              Order Now
            </Button>
            {campaign && featured && (
              <Link
                to={`/menu/${featured.id}`}
                className="inline-flex animate-pop items-center gap-3 rounded-full bg-accent px-5 py-3 text-ink shadow-lift transition-transform [animation-delay:900ms] hover:-translate-y-0.5"
              >
                <span
                  aria-hidden
                  className="grid size-8 place-items-center rounded-full bg-ink text-xs font-bold text-accent"
                >
                  01
                </span>
                <span className="text-sm font-bold leading-tight">
                  {campaign.label}
                  <span className="block text-ink/60">
                    {isLimited ? "Limited orders" : "Available now"}
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl animate-rise [animation-delay:180ms] lg:-mr-10 lg:max-w-none">
          <div
            aria-hidden
            className="absolute -inset-5 rotate-3 rounded-[3rem] border-2 border-primary/30"
          />
          <div className="relative overflow-hidden rounded-[3rem] bg-surface-alt shadow-2xl lg:rotate-2">
            <FoodImage
              src="/images/hero%201.jfif"
              alt="Ashake Alase food selection"
              placeholder={heroContent.placeholder}
              priority
              className="aspect-[4/3] size-full lg:aspect-[5/4]"
            />
          </div>
          <div className="absolute -bottom-6 -left-4 hidden items-center gap-3 rounded-2xl bg-ink px-5 py-4 text-surface shadow-lift sm:flex lg:-left-8">
            <span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-bold text-white">
              AA
            </span>
            <span className="text-sm font-semibold leading-tight">
              Freshly prepared
              <span className="block text-surface/60">
                Made for big moments
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

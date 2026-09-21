import { FoodImage } from "@/components/ui/FoodImage";
import { gallery } from "@/data/mock/content";
import { cn } from "@/lib/cn";

const spans = { tall: "row-span-2", wide: "col-span-2", square: "" } as const;

export function Gallery() {
  return (
    <section className="bg-ink py-16 text-surface lg:py-28">
      <div className="container-page">
        <p className="eyebrow text-accent">A little visual appetite</p>
        <h2 className="mt-3 max-w-xl text-4xl text-surface md:text-6xl">
          The table is calling.
        </h2>
        <div className="mt-10 grid auto-rows-[9.5rem] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[12rem] md:grid-cols-4 md:gap-4 lg:mt-14 lg:auto-rows-[14rem]">
          {gallery.map((g) => (
            <div
              key={g.src}
              className={cn("group overflow-hidden rounded-2xl", spans[g.size])}
            >
              <FoodImage
                src={g.src}
                alt={g.alt}
                placeholder={g.placeholder}
                className="size-full transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

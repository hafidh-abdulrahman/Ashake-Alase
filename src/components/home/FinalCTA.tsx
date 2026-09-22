import { Button } from "@/components/ui/Button";
import { FoodImage } from "@/components/ui/FoodImage";
import { heroContent } from "@/data/mock/content";

export function FinalCTA() {
  return (
    <section className="bg-surface text-ink">
      <div className="container-page py-8 lg:py-12">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-ink md:min-h-[19rem] md:grid-cols-[1.1fr_0.9fr]">
          <div className="relative isolate flex flex-col items-start justify-center overflow-hidden px-6 py-10 sm:px-10 md:px-12 md:py-8 lg:px-14">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 scale-110 bg-cover bg-center opacity-25 blur-xl"
              style={{ backgroundImage: `url(${heroContent.image})` }}
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-ink/80 backdrop-blur-md"
            />
            <div className="relative z-10">
              <h2 className="max-w-lg text-[clamp(2.5rem,5vw,4.5rem)] text-surface">
                Order now.
              </h2>
              <p className="mt-3 max-w-md text-base text-surface/70 md:text-lg">
                Premium meals, delivered fresh and ready to enjoy.
              </p>
              <Button to="/menu" size="lg" className="mt-7">
                Order Now
              </Button>
            </div>
          </div>
          <FoodImage
            src={heroContent.image}
            alt={heroContent.imageAlt}
            placeholder={heroContent.placeholder}
            className="min-h-[12rem] w-full md:min-h-full"
          />
        </div>
      </div>
    </section>
  );
}

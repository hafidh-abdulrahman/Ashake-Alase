import { Button } from "@/components/ui/Button";
import { heroContent } from "@/data/mock/content";

export function FinalCTA() {
  return (
    <section className="bg-surface text-ink">
      <div className="container-page py-8 lg:py-12">
        <div
          className="relative isolate mx-auto flex min-h-[20rem] max-w-6xl items-center overflow-hidden rounded-[2rem] bg-cover bg-center"
          style={{ backgroundImage: `url(${heroContent.image})` }}
        >
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-ink/70 backdrop-blur-[2px]"
          />
          <div className="relative z-10 max-w-xl px-6 py-10 sm:px-10 md:px-12 lg:px-14">
            <h2 className="max-w-lg text-[clamp(2.5rem,5vw,4.5rem)] text-surface">
              Order now.
            </h2>
            <p className="mt-3 max-w-md text-base text-surface/85 md:text-lg">
              Premium meals, delivered fresh and ready to enjoy.
            </p>
            <Button
              to="/menu"
              size="lg"
              className="mt-7 animate-float shadow-[0_12px_24px_rgb(36_25_22/0.28)] transition-transform duration-200 hover:shadow-[0_16px_28px_rgb(36_25_22/0.38)]"
            >
              Order Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="bg-surface text-ink">
      <div className="container-page section-y">
        <div className="mx-auto flex max-w-5xl flex-col items-center rounded-[3rem] bg-ink px-6 py-16 text-center sm:px-12 lg:py-24">
          <h2 className="text-[clamp(2.75rem,7vw,5.5rem)] text-surface">
            Order now.
          </h2>
          <p className="mt-4 max-w-md text-base text-surface/70 md:text-lg">
            Premium meals, delivered fresh and ready to enjoy.
          </p>
          <Button to="/menu" size="lg" className="mt-8">
            Place Order
          </Button>
        </div>
      </div>
    </section>
  );
}

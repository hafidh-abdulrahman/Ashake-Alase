import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="bg-accent text-ink">
      <div className="container-page section-y flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
        <h2 className="max-w-2xl text-[clamp(2.75rem,7vw,5.5rem)]">
          Ready to place your order?
        </h2>
        <Button to="/menu" size="lg" variant="dark">
          Order Now
        </Button>
      </div>
    </section>
  );
}

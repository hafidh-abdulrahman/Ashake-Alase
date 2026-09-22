const steps = [
  {
    n: "01",
    title: "Pick",
    body: "Browse the menu and choose your meal or celebration tray.",
  },
  {
    n: "02",
    title: "Order",
    body: "Add it to your order and tell us where to send it.",
  },
  { n: "03", title: "Pay", body: "Complete your secure online payment." },
  {
    n: "04",
    title: "Enjoy",
    body: "Sit back — your order arrives fresh and ready to serve.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-cream">
      <div className="container-wide py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className={`relative ${i > 0 ? "sm:border-l sm:border-charcoal/10 sm:pl-8" : ""}`}
            >
              <span className="font-display text-6xl font-bold text-ember/20">
                {step.n}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold text-charcoal">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

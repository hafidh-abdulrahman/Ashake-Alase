import { orderingSteps } from "@/data/mock/content";

export function HowItWorks() {
  return (
    <section className="bg-surface-alt grain">
      <div className="container-page section-y">
        <p className="eyebrow text-primary">No long stories. Just good food.</p>
        <h2 className="mt-3 max-w-xl text-4xl md:text-6xl">
          From craving to doorstep.
        </h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-4 md:gap-6 lg:mt-16">
          {orderingSteps.map((s, i) => (
            <li
              key={s.n}
              className={
                "relative flex gap-5 md:block " +
                (i < orderingSteps.length - 1
                  ? "max-md:before:absolute max-md:before:left-6 max-md:before:top-14 max-md:before:-bottom-8 max-md:before:w-px max-md:before:bg-ink/25 md:after:absolute md:after:left-16 md:after:right-2 md:after:top-6 md:after:h-px md:after:bg-ink/25"
                  : "")
              }
            >
              <span className="relative z-10 grid size-16 shrink-0 place-items-center rounded-full bg-primary font-display text-xl font-bold text-white">
                {s.n}
              </span>
              <div className="md:mt-6">
                <h3 className="text-2xl font-bold">{s.title}</h3>
                <p className="mt-1.5 max-w-[16rem] text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

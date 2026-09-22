import { Link } from "react-router-dom";
import { ArrowRight, Clock3, Diamond } from "lucide-react";
import { categoryLabels } from "@/data/mock/content";
import type { ProductCategory } from "@/types";

const categories = Object.entries(categoryLabels) as [
  ProductCategory,
  string,
][];

export function WhatWeOffer() {
  return (
    <section id="menu" className="container-page section-y scroll-mt-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mt-3 font-serif text-5xl tracking-[-0.045em] md:text-7xl">
          OUR SPECIALTIES
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-soft">
          Premium Nigerian cuisine, thoughtfully prepared and beautifully
          packaged.
        </p>
        <ul className="mx-auto mt-7 grid max-w-xl gap-x-10 gap-y-4 text-left text-sm font-bold uppercase tracking-[0.08em] text-ink-soft sm:grid-cols-2">
          <li className="flex items-start gap-3">
            <Diamond
              className="mt-0.5 size-3.5 shrink-0 text-accent"
              aria-hidden
            />
            <span>Signature Rice Dishes</span>
          </li>
          <li className="flex items-start gap-3">
            <Diamond
              className="mt-0.5 size-3.5 shrink-0 text-accent"
              aria-hidden
            />
            <span>Premium Meal Bowls</span>
          </li>
          <li className="flex items-start gap-3">
            <Diamond
              className="mt-0.5 size-3.5 shrink-0 text-accent"
              aria-hidden
            />
            <span>Authentic Nigerian Soups</span>
          </li>
          <li className="flex items-start gap-3">
            <Diamond
              className="mt-0.5 size-3.5 shrink-0 text-accent"
              aria-hidden
            />
            <span>Delicious Proteins &amp; Sides</span>
          </li>
          <li className="flex items-start gap-3">
            <Diamond
              className="mt-0.5 size-3.5 shrink-0 text-accent"
              aria-hidden
            />
            <span>Frozen meals</span>
          </li>
          <li className="flex items-start gap-3">
            <Diamond
              className="mt-0.5 size-3.5 shrink-0 text-accent"
              aria-hidden
            />
            <span>Curated Food Combos</span>
          </li>
        </ul>
        <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold text-ink">
          Ashake Alase — where every meal feels like a treat.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-3xl gap-4 rounded-3xl bg-surface-alt/55 p-5 shadow-[0_18px_45px_-30px_rgb(36_25_22/0.45)] sm:p-6">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Clock3 className="size-5" aria-hidden />
        </span>
        <div>
          <p className="text-sm text-ink-soft">
            Choose your food, enter your delivery details, and pay securely
            online. Your payment is confirmed automatically, so your order can
            be processed without delay.
          </p>
        </div>
      </div>

      <div
        className="mx-auto mt-7 flex max-w-3xl flex-wrap justify-center gap-2"
        aria-label="Browse food categories"
      >
        {categories.map(([category, label]) => (
          <Link
            key={category}
            to={`/menu?category=${category}`}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-5 py-3 text-sm font-bold text-ink-soft transition-colors hover:border-primary hover:text-primary"
          >
            {label}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        ))}
      </div>
    </section>
  );
}

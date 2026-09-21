import { Link } from "react-router-dom";
import { ArrowRight, Clock3 } from "lucide-react";
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
        <p className="eyebrow text-primary">Our specialties</p>
        <h2 className="mt-3 font-serif text-5xl tracking-[-0.045em] md:text-7xl">
          The Ashake table
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-soft">
          Fresh meals, party trays and special packages prepared for everyday
          cravings and big moments.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-3xl gap-4 rounded-3xl bg-surface-alt/55 p-5 shadow-[0_18px_45px_-30px_rgb(36_25_22/0.45)] sm:p-6">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Clock3 className="size-5" aria-hidden />
        </span>
        <div>
          <h3 className="font-bold">Made fresh when you order.</h3>
          <p className="mt-1 text-sm text-ink-soft">
            Choose your food, add your delivery details, then pay by bank
            transfer. Your receipt is verified by our team.
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

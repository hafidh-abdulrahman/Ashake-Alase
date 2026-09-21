import { Hero } from "@/components/home/Hero";
import { FeaturedOffer } from "@/components/home/FeaturedOffer";
import { WhatWeOffer } from "@/components/home/WhatWeOffer";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Gallery } from "@/components/home/Gallery";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhatWeOffer />
      <FeaturedOffer />
      <HowItWorks />
      <Gallery />
      <FinalCTA />
    </>
  );
}

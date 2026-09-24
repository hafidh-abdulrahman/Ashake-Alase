import { Hero } from "@/components/home/Hero";
import { FeaturedOffer } from "@/components/home/FeaturedOffer";
import { WhatWeOffer } from "@/components/home/WhatWeOffer";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Gallery } from "@/components/home/Gallery";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Seo, productionUrl } from "@/components/Seo";
import { site } from "@/config/site";

export default function HomePage() {
  return (
    <>
      <Seo
        title="Ashake Alase | Good food, made for every occasion"
        description="Freshly prepared food, party trays and special food packages from Ashake Alase. Order directly online."
        path="/"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "FoodEstablishment",
            name: site.name,
            url: productionUrl,
            logo: `${productionUrl}${site.logo}`,
            telephone: site.contact.phone,
            email: site.contact.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: site.contact.address,
              addressLocality: "Lagos",
              addressCountry: "NG",
            },
            sameAs: [site.contact.instagram, site.contact.tiktok],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: site.name,
            url: productionUrl,
          },
        ]}
      />
      <Hero />
      <WhatWeOffer />
      <FeaturedOffer />
      <HowItWorks />
      <Gallery />
      <FinalCTA />
    </>
  );
}

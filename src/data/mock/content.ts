import type { ProductCategory } from "@/types";

/**
 * PAGE CONTENT (placeholder copy, gallery and media).
 * Edit here to change homepage text or swap images. Nothing below is a factual claim about the business.
 * In Phase 2 the gallery and hero media can move to Supabase Storage.
 */

export const heroContent = {
  headline: ["Premium meals all day everyday"],
  supporting:
    "Fresh, flavour-packed meals and special packages, made for every craving and occasion.",
  /** Optional looping video. Leave empty to use the image. Example: '/videos/hero.mp4' */
  video: "",
  image:
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85",
  imageAlt: "A freshly prepared spread of Nigerian food",
  placeholder: "grill" as const,
};

export interface OfferingItem {
  title: string;
  description: string;
  category: ProductCategory;
  icon: "combo" | "catering" | "food" | "event";
}

export const offerings: OfferingItem[] = [
  {
    title: "Special Combos",
    description: "Limited-time food packages built around a day or a season.",
    category: "combo",
    icon: "combo",
  },
  {
    title: "Catering",
    description: "Large trays and party portions for family and events.",
    category: "catering",
    icon: "catering",
  },
  {
    title: "Food Orders",
    description: "Fresh meals packed to go, ordered in a few taps.",
    category: "food",
    icon: "food",
  },
  {
    title: "Events & Celebrations",
    description: "Platters and small chops for gatherings of any size.",
    category: "event",
    icon: "event",
  },
];

export const orderingSteps = [
  { n: "01", title: "Choose", text: "Select what you want." },
  { n: "02", title: "Order", text: "Enter your details." },
  {
    n: "03",
    title: "Pay",
    text: "Complete payment using the available payment method.",
  },
  { n: "04", title: "Receive", text: "Your order is prepared and delivered." },
];

export interface GalleryItem {
  /** File in /public/images/gallery/. Replace the file, keep the name (or change it here). */
  src: string;
  alt: string;
  placeholder: "plate" | "grill" | "tray" | "box";
  /** Layout hint for the mosaic on larger screens */
  size: "tall" | "wide" | "square";
}

export const gallery: GalleryItem[] = [
  {
    src: "/images/gallery/1.jpg",
    alt: "Jollof rice served on a plate",
    placeholder: "plate",
    size: "tall",
  },
  {
    src: "/images/gallery/2.jpg",
    alt: "Grilled chicken with pepper sauce",
    placeholder: "grill",
    size: "wide",
  },
  {
    src: "/images/gallery/3.jpg",
    alt: "A catering tray for an event",
    placeholder: "tray",
    size: "tall",
  },
  {
    src: "/images/gallery/4.jpg",
    alt: "A takeaway box ready for delivery",
    placeholder: "box",
    size: "square",
  },
  {
    src: "/images/gallery/5.jpg",
    alt: "Fried plantain and small chops",
    placeholder: "plate",
    size: "square",
  },
];

export const categoryLabels: Record<ProductCategory, string> = {
  combo: "Special Combos",
  catering: "Catering",
  food: "Food Orders",
  event: "Events & Celebrations",
};

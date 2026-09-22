import type { Product } from "@/types";

/**
 * PLACEHOLDER PRODUCTS.
 * Every name, price, quantity and inclusion below is sample data to be replaced with the client's real details.
 * In Phase 2 this file is replaced by a Supabase `products` table (same field names).
 *
 * Images: drop the real photo into /public/images/ using the filename below and it appears automatically.
 * Until then the site shows a designed placeholder.
 */
export const mockProducts: Product[] = [
  {
    id: "october-1st-special",
    name: "October 1st Special",
    summary: "A complete ready-to-serve combo for the day.",
    description:
      "A full food package prepared fresh for October 1st. Everything arrives together, packed and ready to serve. Final combo details will be confirmed by Ashake Alase.",
    price: 18500,
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85",
    placeholder: "plate",
    includes: [
      "Party jollof rice",
      "Peppered grilled chicken",
      "Fried plantain",
      "Coleslaw",
      "Chilled drink",
    ],
    availableQuantity: 40,
    maxPerOrder: 10,
    freeDelivery: false,
    showStockQuantity: false,
    showLimitedAvailability: true,
    isActive: true,
    featured: true,
    category: "combo",
    campaign: { label: "October 1st Special", endsAt: "2026-09-30" },
  },
  {
    id: "jollof-chicken-box",
    name: "Jollof & Chicken Box",
    summary: "A single hot meal, packed to go.",
    description:
      "Smoky jollof rice with a piece of peppered chicken and plantain, packed in a sealed takeaway box.",
    price: 6500,
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",
    placeholder: "box",
    includes: ["Smoky jollof rice", "Peppered chicken", "Fried plantain"],
    availableQuantity: 60,
    maxPerOrder: 20,
    freeDelivery: false,
    showStockQuantity: false,
    showLimitedAvailability: false,
    isActive: true,
    featured: false,
    category: "food",
  },
  {
    id: "small-chops-platter",
    name: "Small Chops Platter",
    summary: "A shareable platter for gatherings.",
    description:
      "A mixed platter of small chops for birthdays, meetings and get-togethers. Serves a small group.",
    price: 25000,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=85",
    placeholder: "tray",
    includes: [
      "Puff puff",
      "Spring rolls",
      "Samosa",
      "Peppered gizzard",
      "Dipping sauces",
    ],
    availableQuantity: 15,
    maxPerOrder: 5,
    freeDelivery: false,
    showStockQuantity: false,
    showLimitedAvailability: false,
    isActive: true,
    featured: false,
    category: "event",
  },
  {
    id: "party-rice-tray",
    name: "Party Rice Tray",
    summary: "A large tray for family or event catering.",
    description:
      "A large foil tray of party rice with your choice of protein, sized for family gatherings and small events.",
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1200&q=85",
    placeholder: "grill",
    includes: [
      "Party jollof rice (large tray)",
      "Assorted protein",
      "Fried plantain",
      "Serves about 10",
    ],
    availableQuantity: 10,
    maxPerOrder: 3,
    freeDelivery: false,
    showStockQuantity: false,
    showLimitedAvailability: false,
    isActive: true,
    featured: false,
    category: "catering",
  },
];

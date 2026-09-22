/**
 * Site-wide configuration. Change brand copy, navigation and contact details here.
 * Anything sensitive or client-specific is read from environment variables (see .env.example).
 */

const env = import.meta.env;

export const site = {
  name: "Ashake Alase",
  tagline: "Good food, made for every occasion",
  logo: "/logo.png",
  contact: {
    phone: (env.VITE_CONTACT_PHONE as string) || "",
    email: (env.VITE_CONTACT_EMAIL as string) || "",
    instagram:
      (env.VITE_CONTACT_INSTAGRAM as string) ||
      "https://www.instagram.com/ashake_alase/",
    tiktok:
      (env.VITE_CONTACT_TIKTOK as string) ||
      "https://www.tiktok.com/@ashake.alase?_r=1&_t=ZS-99uuWweZY1Q",
  },
} as const;

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "Menu / Offers", to: "/menu" },
  { label: "Track Order", to: "/track" },
  { label: "Contact", to: "/contact" },
] as const;

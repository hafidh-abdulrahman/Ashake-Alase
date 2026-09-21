/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: "#211E1B",
          soft: "#2E2A25",
        },
        navy: "#232B45",
        ember: {
          DEFAULT: "#C4321F",
          dark: "#7A1E17",
          light: "#E24A2E",
        },
        burgundy: "#5C1420",
        gold: {
          DEFAULT: "#C7912F",
          light: "#E6BB6B",
        },
        cream: {
          DEFAULT: "#FBF3E3",
          deep: "#F3E6C8",
        },
        beige: "#EDE0C3",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 20px 45px -20px rgba(33, 30, 27, 0.35)",
      },
    },
  },
  plugins: [],
};

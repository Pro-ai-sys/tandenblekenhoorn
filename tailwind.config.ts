import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#faf7f0",
          100: "#f2ead7",
          200: "#e4d3ab",
          300: "#d4b878",
          400: "#c4a052",
          500: "#b08a3e",
          600: "#9c7a3c", // brand accent (from projectplan)
          700: "#7d6130",
          800: "#654e2a",
          900: "#544225",
        },
        cream: {
          50: "#fdfcfa",
          100: "#faf8f3",
          200: "#f5f0e6",
        },
        ink: {
          900: "#1c1a17",
          700: "#3a352d",
          500: "#6b6459",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

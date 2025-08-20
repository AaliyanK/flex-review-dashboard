import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "flex-teal": "#274E4C",
        "flex-warm-white": "#FFF9E9",
        "flex-off-white": "#FFFDF6",
        "flex-text-dark": "#333333",
        "flex-text-medium": "#666666",
        "flex-text-light": "#999999",
        "flex-border": "#E5E5E5",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        flex: "0 2px 8px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17342d",
        forest: "#176b53",
        mint: "#e8f4ed",
        paper: "#f6f8f5",
      },
      boxShadow: { card: "0 8px 28px rgba(23, 52, 45, 0.07)" },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        ".text-theme": {
          color: "var(--theme-color)",
          fontWeight: "bold",
          textShadow: "2px 2px 3px black",
        },
      });
    }),
  ],
};
export default config;

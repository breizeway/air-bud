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
          textShadow:
            "-1px -1px 2px black, 1px 1px 2px black, -1px 1px 2px black, 1px -1px 2px black",
        },
        ".paint": {
          color: "var(--background-color)",
          backgroundColor: "black",
          opacity: "0.85",
          border: "2px solid var(--background-color)",
        },
      });
    }),
  ],
};
export default config;

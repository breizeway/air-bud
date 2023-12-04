import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

// https://tailwindcss.com/docs/adding-custom-styles#customizing-your-theme
const outlineShadow =
  "-1px -1px 2px black, 1px 1px 2px black, -1px 1px 2px black, 1px -1px 2px black";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    boxShadow: {
      outline: outlineShadow,
    },
    dropShadow: {
      outline: outlineShadow,
    },
  },
  plugins: [
    plugin(function ({ addBase, addComponents, theme }) {
      addBase({
        h1: {
          fontSize: theme("fontSize.3xl"),
        },
      }),
        addComponents({
          ".text-shadow-court": {
            textShadow:
              "-1px -1px 2px black, 1px 1px 2px black, -1px 1px 2px black, 1px -1px 2px black",
          },
          ".text-theme": {
            color: "var(--theme-color)",
            fontWeight: "bold",
            textShadow: theme("dropShadow.outline"),
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

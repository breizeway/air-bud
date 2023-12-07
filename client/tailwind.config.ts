import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

// https://tailwindcss.com/docs/adding-custom-styles#customizing-your-theme
const outlineShadow =
  "calc(-1rem / 16) calc(-1rem / 16) calc(1rem / 8) black, calc(1rem / 16) calc(1rem / 16) calc(1rem / 8) black, calc(-1rem / 16) calc(1rem / 16) calc(1rem / 8) black, calc(1rem / 16) calc(-1rem / 16) calc(1rem / 8) black";
const contentWidth = "56rem";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        outline: outlineShadow,
      },
      dropShadow: {
        outline: outlineShadow,
      },
      width: {
        content: contentWidth,
      },
      maxWidth: {
        content: contentWidth,
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, addComponents, theme }) {
      addBase({
        h1: {
          fontSize: theme("fontSize.3xl"),
          marginTop: theme("margin.3"),
          marginBottom: theme("margin.3"),
        },
        h2: {
          fontSize: theme("fontSize.2xl"),
          marginTop: theme("margin.2"),
          marginBottom: theme("margin.2"),
        },
        ol: { listStyle: "decimal" },
        li: { margin: "0.5rem 0 0.5rem 2rem" },
        "input[type=text]": {
          paddingLeft: theme("padding.1"),
          paddingRight: theme("padding.1"),
        },
      }),
        addComponents({
          ".text-shadow-court": {
            textShadow: outlineShadow,
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
            border: "calc(1rem / 8) solid var(--background-color)",
          },
        });
    }),
  ],
};
export default config;

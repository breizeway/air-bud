import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

// https://tailwindcss.com/docs/adding-custom-styles#customizing-your-theme
const outlineShadow =
  "-1px -1px 2px black, 1px 1px 2px black, -1px 1px 2px black, 1px -1px 2px black";
const contentWidth = "920px";

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

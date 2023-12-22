import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

// https://tailwindcss.com/docs/adding-custom-styles#customizing-your-theme
const outlineShadow =
  "-0.0625rem -0.0625rem 0.125rem black, 0.0625rem 0.0625rem 0.125rem black, -0.0625rem 0.0625rem 0.125rem black, 0.0625rem -0.0625rem 0.125rem black";
const contentWidth = "56rem";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          "100": "#FFEFD6",
          "300": "#D7C9B3",
          "500": "#9C9181",
        },
      },
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
        // button: {},
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
            border: "0.125rem solid var(--background-color)",
          },
          ".plaque": {
            backgroundColor: theme("colors.beige.300"),
            borderLeft: `0.33rem solid ${theme("colors.beige.100")}`,
            borderTop: `0.33rem solid ${theme("colors.beige.100")}`,
            borderRight: `0.33rem solid ${theme("colors.beige.500")}`,
            borderBottom: `0.33rem solid ${theme("colors.beige.500")}`,
          },
        });
    }),
  ],
};
export default config;

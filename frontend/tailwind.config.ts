import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: "#ACB7F2",
        secondary: "#023059",
        background: "#F7FAFC",
        header: "#ACB7F2",
        accent: "#E78740",
        white: "#FFFFFF",
        menuBarText: "#686868",
        text: "#333333",
      },
    },
  },
  plugins: [],
};

export default config;

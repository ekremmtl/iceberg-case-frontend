import type { Config } from "tailwindcss";

export default {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["League Spartan", "Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primary: {
          DEFAULT: "#E6007E",
          hover: "#c4006b",
        },
        card: "#fcfcfc",
      },
    },
  },
  plugins: [],
} satisfies Config;

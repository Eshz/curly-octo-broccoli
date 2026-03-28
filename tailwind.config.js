/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#f5f2ed",
        charcoal: "#1a1a1a",
        gold: "#bda780"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ['"Cormorant Garamond"', "serif"]
      },
      boxShadow: {
        luxe: "0 24px 80px rgba(26, 26, 26, 0.12)"
      }
    }
  },
  plugins: []
};

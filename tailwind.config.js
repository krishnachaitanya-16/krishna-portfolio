/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#7B2FBE",
        "accent-pink": "#C084FC",
      },
      fontFamily: {
        grotesk: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "hero-peach": "#F7A8A3",
        "hero-green": "#3BC1AC",
        "heading-black": "#333333",
        "stroke": "#F0F0F0",
        "text-gray": "#878383",
        "hero-tertiary": "#F4ECE7",
        "primary-stroke": "#D0D0D0",
        "icon-color": "#9B9898",
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        defaultColor: "white",
        fillColor: "#50C878",
        pathColor: "red",
        targetColor: "yellow"
      }
    },
  },
  plugins: [],
}

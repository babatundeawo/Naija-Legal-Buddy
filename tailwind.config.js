/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
      },
      colors: {
        brand: {
          bg: "#FFFFFF",
          ink: "#000000",
          accent: "#D4AF37",
          muted: "#F8F9FA",
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'astillero-azul': '#002855', /* Azul marino sobrio institucional */
        'astillero-verde': '#10b981', /* Verde para acentos de éxito */
      }
    },
  },
  plugins: [],
}
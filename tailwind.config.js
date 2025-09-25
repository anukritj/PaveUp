/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d9eeff',
          200: '#b6dbff',
          300: '#84c0ff',
          400: '#4ea0ff',
          500: '#1f7fff',
          600: '#0f63db',
          700: '#0b4db0',
          800: '#0b438f',
          900: '#0c3a74'
        }
      }
    }
  },
  plugins: []
}



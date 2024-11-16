/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customRedGray: '#c8bbbb',
        customGray: '#d9d9d9',
        bgsubmit: '#66687A',
        bgNavBar: '#E9E6E6',
        bgBody: '#A9A9A9'
      },
    },
  },
  plugins: [],
}

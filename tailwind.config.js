/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html","./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
  safelist: ['bg-emerald-600','text-emerald-600','dark','rounded-2xl','shadow']

};

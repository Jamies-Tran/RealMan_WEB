/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  prefix: 'tw-',
  content: [
    './src/**/*.{html,ts}',
    './components/**/*.{html,js}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
  corePlugins: {
    preflight: false,
  },
};

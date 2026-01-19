/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Suppress empty selector warnings from Tailwind CSS
  corePlugins: {
    preflight: true,
  },
};

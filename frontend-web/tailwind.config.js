/** @type {import('tailwindcss').Config} */
// Tailwind v3.4 pinned on purpose (project decision): preserves the original visual output.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      /*
       * v4-NAME COMPATIBILITY (additive, delete this block to revert):
       * The original interface code uses class names introduced in Tailwind v4
       * (shadow-2xs x61, shadow-xs x27, backdrop-blur-xs x8) and relies on the v4 meaning of
       * shadow-sm (x24). Plain v3.4 silently ignores the first three, so those elements would
       * render with NO shadow/blur. The values below are the official Tailwind v4 values.
       */
      boxShadow: {
        '2xs': '0 1px rgb(0 0 0 / 0.05)',
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      },
      backdropBlur: {
        xs: '4px',
      },
    },
  },
  plugins: [],
}

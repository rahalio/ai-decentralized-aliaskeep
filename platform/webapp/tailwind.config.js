/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#E8EDF2',
        charcoal: {
          950: '#0C0F14',
          900: '#151A22',
          800: '#1C2330',
        },
        graphite: '#8A96A5',
        link: {
          DEFAULT: '#2EC4B6',
          dim: '#1A6F68',
        },
        amber: '#E0A12B',
        coral: '#E85D4C',
        seal: '#9AA4B2',
        brand: '#7FE7DC',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
      },
    },
  },
  plugins: [],
};

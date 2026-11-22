/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pizza: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        crust: {
          50: '#fbf8f3',
          100: '#f6f0e4',
          200: '#ede0c8',
          300: '#e1cb9f',
          400: '#d3b174',
          500: '#b8944f',
          600: '#9d783d',
          700: '#7c5c2f',
          800: '#5a4221',
          900: '#3e2d17',
        },
        tomato: {
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b',
        },
        basil: {
          500: '#16a34a',
          600: '#15803d',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
};

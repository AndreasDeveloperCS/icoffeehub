import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        espresso: {
          50: '#F7F1EE',
          100: '#ECE0DA',
          200: '#D3B9AE',
          300: '#B98E7D',
          400: '#8F5C48',
          500: '#5D3A2E',
          600: '#4E342E',
          700: '#3E2723',
          800: '#301D1A',
          900: '#221410',
        },
        cream: {
          DEFAULT: '#F5F5DC',
          50: '#FFFEF9',
          100: '#FBF9EF',
          200: '#F5F5DC',
          300: '#EDE9C9',
        },
        gold: {
          DEFAULT: '#C9A227',
          50: '#FBF4DE',
          100: '#F3E3AC',
          300: '#DDBD5C',
          500: '#C9A227',
          600: '#A9871F',
          700: '#8A6D19',
        },
        forest: {
          DEFAULT: '#2E7D32',
          50: '#E9F5EA',
          300: '#7CB380',
          500: '#2E7D32',
          600: '#256628',
          700: '#1D501F',
        },
        charcoal: {
          DEFAULT: '#212121',
          50: '#F5F5F5',
          200: '#E0E0E0',
          400: '#9E9E9E',
          600: '#4A4A4A',
          800: '#2A2A2A',
          900: '#171717',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(33,24,20,0.04), 0 4px 16px -4px rgba(33,24,20,0.10)',
        'card-hover': '0 2px 4px rgba(33,24,20,0.06), 0 12px 28px -6px rgba(33,24,20,0.18)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      backgroundImage: {
        'grain-fade': 'radial-gradient(circle at 20% 20%, rgba(201,162,39,0.10), transparent 45%)',
      },
    },
  },
  plugins: [],
};
export default config;

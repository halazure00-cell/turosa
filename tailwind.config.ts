import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Islamic Theme Color Palette
        primary: {
          DEFAULT: '#1B5E20', // Hijau tua
          light: '#2E7D32',
          dark: '#0D3B10',
        },
        secondary: {
          DEFAULT: '#F5F5DC', // Krem
          light: '#FAFAEB',
          dark: '#E8E8CD',
        },
        accent: {
          DEFAULT: '#5D4037', // Coklat
          light: '#6D4C41',
          dark: '#4E342E',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

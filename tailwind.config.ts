import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        genshin: {
          DEFAULT: '#4a8bc2',
          light: '#6ba3d4',
          dark: '#2e5f8a',
        },
        starrail: {
          DEFAULT: '#ffc870',
          light: '#ffd699',
          dark: '#d4a554',
        },
        honkai: {
          DEFAULT: '#a855f7',
          light: '#c084fc',
          dark: '#7e22ce',
        },
        zzz: {
          DEFAULT: '#ef4444',
          light: '#f87171',
          dark: '#dc2626',
        },
      },
    },
  },
  plugins: [],
};
export default config;

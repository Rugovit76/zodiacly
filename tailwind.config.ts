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
        cosmic: {
          bg: '#0a0e27',
          surface: '#141b3d',
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#ec4899',
          gold: '#fbbf24',
        },
      },
      backgroundImage: {
        'gradient-cosmic': 'linear-gradient(to bottom right, #0a0e27, #1a1f4d, #2d1b4e)',
      },
    },
  },
  plugins: [],
};

export default config;

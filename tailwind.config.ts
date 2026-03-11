import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0F172A', // Latar belakang utama
          800: '#1E293B', // Latar belakang kartu/elemen
        },
        beige: {
          100: '#F5F5DC', // Teks utama
          200: '#E8E4C9', // Teks sekunder
        }
      },
    },
  },
  plugins: [],
};
export default config;
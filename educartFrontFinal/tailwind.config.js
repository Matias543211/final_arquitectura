import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#ffffff", // blanco neutro más claro
            foreground: "#111827", // gray-900 suave
            primary: {
              DEFAULT: "#818cf8", // indigo-400
              foreground: "#0f172a",
            },
            secondary: {
              DEFAULT: "#fbbf24", // amber-400
              foreground: "#1f2937",
            },
            // Color de fondo para las tarjetas (bg-white)
            content1: "#f8fafc", // slate-50 para dar ligereza
          },
        },
        dark: {
          colors: {
            background: "#1f2937", // slate-800 más claro que el neutral-900
            foreground: "#e5e7eb", // gray-200
            primary: {
              DEFAULT: "#a5b4fc", // indigo-300
              foreground: "#0b1021",
            },
            secondary: {
              DEFAULT: "#fcd34d", // amber-300
              foreground: "#111827",
            },
            // Color de fondo para las tarjetas (neutral-700)
            content1: "#2d3748",
          },
        },
      },
    }),
  ],
}
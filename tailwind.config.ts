import type { Config } from "tailwindcss";

export default {
  darkMode: ['class'],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Colores existentes...
      },
      // Mejoras para transiciones en modo oscuro
      transitionProperty: {
        'background': 'background-color, color',
        'opacity': 'opacity',
        'transform': 'transform',
      },
      transitionDuration: {
        '350': '350ms',
      },
      transitionTimingFunction: {
        'dark-mode': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // Keyframes para animaciones más suaves
      keyframes: {
        'dark-mode-transition': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Otros keyframes existentes...
      },
      animation: {
        'dark-mode-enter': 'dark-mode-transition 0.3s ease-out',
        // Otras animaciones existentes...
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
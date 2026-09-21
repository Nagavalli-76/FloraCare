/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        botanical: {
          50: "#f2f6f0",
          100: "#e3ede0",
          200: "#c7dbc0",
          300: "#a3c497",
          400: "#7fa96f",
          500: "#5f8b4f",
          600: "#4a6f3d",
          700: "#3c5a33",
          800: "#31482b",
          900: "#293c25",
        },
        sage: {
          50: "#f4f6f2",
          100: "#e7ede1",
          200: "#cfdcc3",
          300: "#b0c69d",
        },
        cream: {
          50: "#fdfbf5",
          100: "#faf5e8",
          200: "#f3e9cf",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 2px 12px rgba(41, 60, 37, 0.06)",
        card: "0 4px 20px rgba(41, 60, 37, 0.08)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
}

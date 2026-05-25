/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // ✅ REQUIRED

  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      animation: {
        "gradient-x": "gradient-x 8s ease infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },

  plugins: [],
};
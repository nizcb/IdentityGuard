/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/client/pages/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "320px",
        sm: "375px",
        sml: "500px", // Small-medium breakpoint (custom)
        md: "667px",
        mdl: "768px", // Medium-large breakpoint (custom)
        lg: "960px",
        lgl: "1024px", // Large-large breakpoint (custom)
        xl: "1280px",
      },
      fontFamily: {
        bodyFont: ["Poppins", "sans-serif"],
        titleFont: ["Montserrat", "sans-serif"],
      },
      colors: {
        bodyColor: "#FFFFFF", // Dark bluish-gray (base)
        lightText: "#007bff", // Light grayish-white for readability
        boxBg: "linear-gradient(145deg, #1e2024, #23272b)", // Subtle gradient for boxes
        designColor: "#007bff", // Royal blue accent color (complementary)
        primary: "#ffc107", // Gold for primary elements (optional)
        secondary: "#000000", // Light coral for secondary elements (optional)
      },
      boxShadow: {
        shadowOne: "10px 10px 19px #1c1e22, -10px -10px 19px #262a2e",
      },
    },
  },
  plugins: [],
};

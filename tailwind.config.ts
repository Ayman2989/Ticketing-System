import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      dropShadow: {
        "white-glow": "0 0 20px white, 0 0 50px white",
      },
      transitionDuration: {
        "700": "700ms",
      },
      transitionTimingFunction: {
        "ease-in-out": "ease-in-out",
      },
      scale: {
        "102": "1.005",
      },
      screens: {
        xs: "546px",
        mb: "240px",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        etuwaCustom: {
          DEFAULT: "#766af0", // Main shade
          light: "#a89dfb", // Optional lighter shade
          dark: "#5748b8", // Optional darker shade
          wb: "#e5eff6",
          lb: "#8cbedd",
          b: "#0187c3",
          sb: "#2b9adb",
          db: "#1d3581",
        },
      },
      animation: {
        moveRight: "moveRight 0.5s ease-in-out", // Add the shake animation
        moveLeft: "moveLeft 0.5s ease-in-out", // Move left animation
      },
      keyframes: {
        moveRight: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(10px)" }, // Move right by 10px
          "100%": { transform: "translateX(0)" }, // Bring it back to the initial position
        },
        moveLeft: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-10px)" }, // Move left by 10px
          "100%": { transform: "translateX(0)" }, // Bring it back to the initial position
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

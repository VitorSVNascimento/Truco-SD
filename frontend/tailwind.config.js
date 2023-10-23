import scrollbarPlugin from "tailwind-scrollbar";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        screen: ["100vh", "100svh"],
        
      },
      minHeight: {
        screen: ["100vh", "100svh"],
      },
      maxHeight: {
        screen: ["100vh", "100svh"],
      }
    },
  },
  plugins: [
    scrollbarPlugin
  ],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff3ff",
          100: "#dbe5ff",
          200: "#b3c7ff",
          300: "#809fff",
          400: "#4d77ff",
          500: "#0038F8",
          600: "#002ECC",
          700: "#002399",
          800: "#001966",
          900: "#001766",
        },
        surface: {
          page: "#f8fafc",
          card: "#ffffff",
          dark: "#16161e",
          "dark-hover": "#1e1e2a",
        },
        status: {
          success: "#059669",
          "success-light": "#d1fae5",
          warning: "#d97706",
          "warning-light": "#fef3c7",
          danger: "#dc2626",
          "danger-light": "#fee2e2",
          info: "#2563eb",
          "info-light": "#dbeafe",
        },
      },
      fontFamily: {
        sans: ["Figtree", "system-ui", "sans-serif"],
      },
      fontSize: {
        micro: ["0.625rem", { lineHeight: "0.875rem" }],   // 10px
        tiny: ["0.6875rem", { lineHeight: "1rem" }],        // 11px
        xs: ["0.75rem", { lineHeight: "1rem" }],            // 12px
        sm: ["0.875rem", { lineHeight: "1.25rem" }],        // 14px
        base: ["1rem", { lineHeight: "1.5rem" }],           // 16px
        lg: ["1.125rem", { lineHeight: "1.75rem" }],        // 18px
        xl: ["1.25rem", { lineHeight: "1.75rem" }],         // 20px
        "2xl": ["1.5rem", { lineHeight: "2rem" }],          // 24px
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],     // 30px
        "4xl": ["2rem", { lineHeight: "2.5rem" }],          // 32px
      },
      borderRadius: {
        badge: "0.5rem",     // 8px — badges, chips
        control: "0.75rem",  // 12px — buttons, inputs, selects
        card: "1rem",        // 16px — cards, modals
        panel: "1.25rem",    // 20px — large panels, sections
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover":
          "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
        dropdown:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        modal: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
      },
      spacing: {
        sidebar: "280px",
        "sidebar-collapsed": "88px",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.2s ease-out",
        "slide-down": "slideDown 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

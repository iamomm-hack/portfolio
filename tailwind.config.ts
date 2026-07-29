import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
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
      padding: "var(--gutter-page)",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        "display-hero": ["var(--type-display-hero)", { lineHeight: "0.9" }],
        "display-section": ["var(--type-display-section)", { lineHeight: "0.94" }],
        "display-project": ["var(--type-display-project)", { lineHeight: "0.96" }],
        "heading-1": ["var(--type-heading-1)", { lineHeight: "1" }],
        "heading-2": ["var(--type-heading-2)", { lineHeight: "1.1" }],
        "heading-3": ["var(--type-heading-3)", { lineHeight: "1.2" }],
        lead: ["var(--type-lead)", { lineHeight: "1.5" }],
        body: ["var(--type-body)", { lineHeight: "1.6" }],
        supporting: ["var(--type-supporting)", { lineHeight: "1.5" }],
        technical: ["var(--type-technical)", { lineHeight: "1.4" }],
      },
      spacing: {
        "token-1": "var(--space-1)",
        "token-2": "var(--space-2)",
        "token-3": "var(--space-3)",
        "token-4": "var(--space-4)",
        "token-6": "var(--space-6)",
        "token-8": "var(--space-8)",
        "token-12": "var(--space-12)",
        "token-16": "var(--space-16)",
        "token-24": "var(--space-24)",
        "token-36": "var(--space-36)",
        "token-48": "var(--space-48)",
      },
      colors: {
        carbon: "rgb(var(--color-carbon) / <alpha-value>)",
        graphite: "rgb(var(--color-graphite) / <alpha-value>)",
        instrument: "rgb(var(--color-instrument) / <alpha-value>)",
        elevated: "rgb(var(--color-elevated) / <alpha-value>)",
        bone: "rgb(var(--color-bone) / <alpha-value>)",
        "lab-secondary": "rgb(var(--color-secondary) / <alpha-value>)",
        "lab-muted": "rgb(var(--color-muted) / <alpha-value>)",
        signal: "rgb(var(--color-signal) / <alpha-value>)",
        focus: "rgb(var(--color-focus) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        border: "var(--border-default-color)",
        divider: "var(--border-divider-color)",
        input: "var(--border-default-color)",
        ring: "rgb(var(--color-focus) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        brand: "rgb(var(--color-signal) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        technical: "var(--radius-technical)",
        control: "var(--radius-control)",
        panel: "var(--radius-panel)",
        media: "var(--radius-media)",
        sm: "var(--radius-technical)",
        md: "var(--radius-control)",
        lg: "var(--radius-panel)",
        xl: "var(--radius-media)",
      },
      boxShadow: {
        sm: "var(--shadow-contact)",
        md: "var(--shadow-panel)",
        lg: "var(--shadow-panel)",
        contact: "var(--shadow-contact)",
        panel: "var(--shadow-panel)",
        media: "var(--shadow-media)",
        instrument: "var(--shadow-instrument)",
        signal: "var(--shadow-signal)",
      },
      maxWidth: {
        canvas: "var(--container-canvas)",
        wide: "var(--container-wide)",
        content: "var(--container-content)",
        editorial: "var(--container-editorial)",
        form: "var(--container-form)",
      },
      zIndex: {
        environment: "0",
        scene: "10",
        document: "20",
        sticky: "40",
        navigation: "50",
        overlay: "60",
        dialog: "80",
        feedback: "90",
      },
      backdropBlur: {
        glass: "var(--blur-glass)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;

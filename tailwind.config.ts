import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      padding: {
        DEFAULT: "2rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      center: true,
    },
    extend: {
      colors: {
        "kv-light-green": "#B3DEC2",
        "kv-green": "#1B9B48",
        "kv-venue-header": "#1F2937",
        "kv-secondary": "#FF48000D",
        "kv-primary": "#FF4800",
        "kv-bg-slate": "#F8FAFC",
        "kv-black": "#323232",
        "kv-text-gray": "#475569",
        "kv-semi-black": "#1E293B",
        "kv-grey-600": "#4B5563",
        "kv-h1": "#111827",

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      fontFamily: {
        gabaritoHeading: ["Gabarito", "sans-serif"], 
        interTightText: ["Inter Tight", "sans-serif"],
      },

      letterSpacing: {
        tight: "-0.006em",
        tighter: "-0.013em",
        normal: "-0.014em",
        wide: "-0.01em",
        wider: "-0.008em;",
        widest: "0.1em",
        "extra-wide": "0.005em",
        "more-wide": "-0.007em",
      },

      lineHeight: {
        "leading-7": "25.6px",
        "leading-8": "30px",
        "leading-9": "38px",
        "leading-10": "44px",
        "leading-loose": "56px",
      },
      
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: {
        min: "640px",
      },
      md: {
        min: "967px",
      },
      lg: {
        min: "1024px",
      },
      xl: {
        min: "1440px",
      },
      "2xl": {
        min: "1680px",
      },
      "3xl": {
        min: "1920px",
      },
      "2k": {
        min: "2560px",
      },
    },
    extend: {
      colors: {
        green: "#61B372",
        red: "#EF6A5A",
        oragne: "#F7931A",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        progress: {
          from: {
            transform: "scaleX(0)",
          },
          to: {
            transform: "scaleX(1)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        float2: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        shake: {
          "0%, 10%": {
            transform: "translate(0, 0)",
            backgroundColor: "transparent",
          },
          "15%": {
            transform: "translate(0, 10px)",
            backgroundColor: "#512da8",
          },
          "20%": {
            transform: "translate(-10px, 10px)",
            backgroundColor: "red",
          },
          "25%": {
            transform: "translate(10px, -10px)",
            backgroundColor: "blue",
          },
          "30%": {
            transform: "translate(-10px, -10px)",
            backgroundColor: "yellow",
          },
          "35%, 100%": {
            transform: "translate(0, 0)",
            backgroundColor: "transparent",
          },
        },
        "move-right": {
          "0%, 100%": { transform: "translate(-50%, -50%)" },
          "50%": { transform: "translate(-30%, -50%)" },
        },
        "fade-in": {
          "0%, 100%": { opacity: "0" },
          "30%": { opacity: "1" },
        },
        "fade-in-out": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        "float-fade-in-out": {
          "0%, 100%": { transform: "translateY(0)", opacity: "1" },
          "50%": { transform: "translateY(-10px)", opacity: "0.5" },
        },
        "float-scale": {
          "0%, 100%": {
            transform: "translateY(0) scale(1)",
          },
          "50%": {
            transform: "translateY(-20px) scale(1.1)",
          },
        },
        "shadow-pulse": {
          "0%, 100%": {
            boxShadow: "0px 0px 0px 0px #5B57B2 inset",
          },
          "50%": {
            boxShadow: "0px 0px 34px 0px #5B57B2 inset",
          },
        },
        "shadow-pink": {
          "0%, 100%": {
            boxShadow: "0px 0px 0px 0px #FF79ED inset",
          },
          "50%": {
            boxShadow: "0px 0px 34px 0px #FF79ED inset",
          },
        },
        "shadow-green": {
          "0%, 100%": {
            boxShadow: "0px 0px 0px 0px #57B28E inset",
          },
          "50%": {
            boxShadow: "0px 0px 34px 0px #57B28E inset",
          },
        },
        "slide-left": {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(-100%)" },
        },
        "gradient-rotate": {
          "0%, 100%": {
            "background-image":
              "linear-gradient(45deg, #00CCFF, white, #DD83DE)",
          },
          "25%": {
            "background-image":
              "linear-gradient(135deg, #00CCFF, white, #DD83DE)",
          },
          "50%": {
            "background-image":
              "linear-gradient(225deg, #00CCFF, white, #DD83DE)",
          },
          "75%": {
            "background-image":
              "linear-gradient(315deg, #00CCFF, white, #DD83DE)",
          },
        },
        "rotate-360": {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
        "cursor-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "bounce-twice": {
          "0%, 100%": { transform: "translateY(0)" },
          "20%": { transform: "translateY(-3px)" },
          "30%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
          "60%": { transform: "translateY(0)" },
        },
        "slide-right-fade": {
          "0%": {
            left: "0",
            opacity: "0",
          },
          "20%": {
            opacity: "1",
          },
          "80%": {
            opacity: "1",
          },
          "100%": {
            left: "80%",
            opacity: "0",
          },
        },
        "scroll-left": {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-100%)",
          },
        },
      },
      fontFamily: {
        gt: "GT",
        pp: "PP",
        sf: "SF",
        "sf-bold": "SF-Bold",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        progress: "progress 1s ease-in-out",
        float: "float 3s ease-in-out infinite",
        float2: "float2 3s ease-in-out infinite",
        shake: "shake 1.5s ease-in-out infinite",
        "move-right": "move-right 1s ease-in-out infinite",
        "fade-in": "fade-in 2s ease-in-out infinite",
        "fade-in-out": "fade-in-out 2s ease-in-out infinite",
        "float-fade-in-out": "float-fade-in-out 3s ease-in-out infinite",
        "float-scale": "float-scale 3s ease-in-out infinite",
        "shadow-pulse": "shadow-pulse 2s ease-in-out infinite",
        "shadow-pink": "shadow-pink 2s ease-in-out infinite",
        "shadow-green": "shadow-green 2s ease-in-out infinite",
        "slide-left": "slide-left 2s linear infinite",
        "gradient-rotate": "gradient-rotate 8s linear infinite",
        "spin-slow": "rotate-360 30s linear infinite",
        "cursor-blink": "cursor-blink 1s step-end infinite",
        "bounce-twice": "bounce-twice 2s ease-in-out infinite",
        "slide-right-fade": "slide-right-fade 2s ease-in-out infinite",
        "scroll-left": "scroll-left 30s linear infinite",
      },
      borderRadius: {
        default: "var(--radius)",
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
      },
      fontSize: {
        xs: "10px",
        sm: "12px",
        md: "14px",
        base: "16px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
        "4xl": "38px",
        "5xl": "48px",
      },
    },
  },
  plugins: [animate],
} satisfies Config;

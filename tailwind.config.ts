import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"], // Enforcing dark mode via class
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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))', // Will be dark
				foreground: 'hsl(var(--foreground))', // Will be light
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))', // For glassmorphism
					foreground: 'hsl(var(--card-foreground))'
				},
				// Updated Custom Neon Colors - Removed blue, purple, lavender, indigo
				"neon-pink": "#D94F7A",     // Was #FF00AA (Energetic) - Deep Pink/Rose
				"neon-red": "#C94C4C",      // Was #FF1D58 (Romantic) - Warm Red
				"neon-teal": "#43A08B",     // Was #00FCA8 (Peaceful) - Earthy Teal
        "neon-orange": "#E87E04",   // Was #FF9900 (Adventurous) - Burnt Orange
				"brand-deep-black": "#0A0A0A",
				"brand-charcoal": "#1A1A1A",
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 5px var(--glow-color), 0 0 10px var(--glow-color)' },
          '50%': { boxShadow: '0 0 15px var(--glow-color), 0 0 25px var(--glow-color)' },
        },
        'subtle-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite',
        'subtle-pulse': 'subtle-pulse 2.5s ease-in-out infinite',
			},
      boxShadow: { // These will automatically use the updated hex values from above
        'neon-pink': '0 0 15px #D94F7A, 0 0 5px #D94F7A',
        'neon-red': '0 0 15px #C94C4C, 0 0 5px #C94C4C',
        'neon-teal': '0 0 15px #43A08B, 0 0 5px #43A08B',
        'neon-orange': '0 0 15px #E87E04, 0 0 5px #E87E04',
      }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

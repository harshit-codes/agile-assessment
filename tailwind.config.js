/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))',
  				light: 'hsl(var(--primary-light))',
  				dark: 'hsl(var(--primary-dark))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))'
  			},
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				foreground: 'hsl(var(--warning-foreground))'
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
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			analyst: {
  				DEFAULT: 'hsl(var(--analyst))',
  				foreground: 'hsl(var(--analyst-foreground))'
  			},
  			diplomat: {
  				DEFAULT: 'hsl(var(--diplomat))',
  				foreground: 'hsl(var(--diplomat-foreground))'
  			},
  			sentinel: {
  				DEFAULT: 'hsl(var(--sentinel))',
  				foreground: 'hsl(var(--sentinel-foreground))'
  			},
  			explorer: {
  				DEFAULT: 'hsl(var(--explorer))',
  				foreground: 'hsl(var(--explorer-foreground))'
  			},
  			'agree-strong': 'hsl(var(--agree-strong))',
  			'agree-light': 'hsl(var(--agree-light))',
  			neutral: 'hsl(var(--neutral))',
  			'disagree-light': 'hsl(var(--disagree-light))',
  			'disagree-strong': 'hsl(var(--disagree-strong))',
  			'custom-light-green': 'hsl(var(--custom-light-green))',
  			'custom-neutral': 'hsl(var(--custom-neutral))',
  			'custom-burgundy': 'hsl(var(--custom-burgundy))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			DEFAULT: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-body)',
  				'system-ui',
  				'sans-serif'
  			],
  			display: [
  				'var(--font-head)',
  				'serif'
  			],
  			heading: [
  				'var(--font-head)',
  				'serif'
  			],
  			head: [
  				'var(--font-head)',
  				'serif'
  			],
  			body: [
  				'var(--font-body)',
  				'sans-serif'
  			],
  			accent: [
  				'var(--font-body)',
  				'sans-serif'
  			],
  			serif: [
  				'var(--font-head)',
  				'serif'
  			],
  			mono: [
  				'var(--font-mono)',
  				'monospace'
  			]
  		},
  		boxShadow: {
  			modern: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1), 0 0 0 1px rgb(255 255 255 / 0.05)',
  			'modern-lg': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1), 0 0 0 1px rgb(255 255 255 / 0.05)',
  			'2xs': 'var(--shadow-2xs)',
  			xs: 'var(--shadow-xs)',
  			sm: 'var(--shadow-sm)',
  			DEFAULT: 'var(--shadow)',
  			md: 'var(--shadow-md)',
  			lg: 'var(--shadow-lg)',
  			xl: 'var(--shadow-xl)',
  			'2xl': 'var(--shadow-2xl)'
  		},
  		backdropBlur: {
  			xs: '2px'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			shine: {
  				'0%': {
  					'background-position': '100%'
  				},
  				'100%': {
  					'background-position': '-100%'
  				}
  			},
  			rainbow: {
  				'0%': {
  					'background-position': '0% 50%'
  				},
  				'50%': {
  					'background-position': '100% 50%'
  				},
  				'100%': {
  					'background-position': '0% 50%'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			shine: 'shine 5s linear infinite',
  			rainbow: 'rainbow 6s ease-in-out infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
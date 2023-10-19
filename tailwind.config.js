/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		"./components/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./plugins/**/*.{js,ts}",
		"./app.vue",
	  ],
	daisyui: {
		darkTheme: "dark", // name of one of the included themes for dark mode
		base: true, // applies background color and foreground color for root element by default
		styled: true, // include daisyUI colors and design decisions for all components
		themes: [{
			dark: {
				"color-scheme": "dark",
				primary: '#6a97df',
				"primary-content": "#ffffff",
				secondary: '#ff5757',
				"secondary-content": "#ffffff",
				accent: "#1FB2A5",
				"accent-content": "#ffffff",
				neutral: "#191D24",
				"neutral-focus": "#111318",
				"neutral-content": "#A6ADBB",
				"base-50": "#343c4b",
				"base-100": "#2A303C",
				"base-200": "#242933",
				"base-300": "#20252E",
				"base-content": "#A6ADBB",
			},
			light: {	
				"color-scheme": "light",
				primary: '#6a97df',
				"primary-content": "#ffffff",
				secondary: '#ff5757',
				"secondary-content": "#ffffff",
				neutral: '#475569',
				"neutral-content": "#ffffff",
				accent: "#37cdbe",
				"accent-content": "#163835",
				"base-50": "#ffffff",
				"base-100": "#f1f1f1",
				"base-200": "#F2F2F2",
				"base-300": "#E5E6E6",
				"base-content": "#1f2937",
			},
		}],

	},
	theme: {
		extend: {
			width: {
				'icon': 'clamp(1.5rem, 7vw, 2.5rem)',
			},
			colors: {
				'primary': '#6a97df',
				'accent': '#8397fe50',
				'secondary': '#a6adbb',
				'tertiary': '#ff5757',
				'grey-base-50': '#f2f5fd',
				'grey-base-100': '#dee6f9',
			},
			grayscale: {
				10: '10%',
			}
		},
		screens: {
			'xs': '440px',
			// => @media (min-width: 440px) { ... }

			'sm': '640px',
			// => @media (min-width: 640px) { ... }

			'md': '768px',
			// => @media (min-width: 768px) { ... }

			'lg': '1024px',
			// => @media (min-width: 1024px) { ... }

			'xl': '1280px',
			// => @media (min-width: 1280px) { ... }

			'2xl': '1536px',
			// => @media (min-width: 1536px) { ... }
		},
	},
	plugins: [require("daisyui"), require("@tailwindcss/typography")],
}

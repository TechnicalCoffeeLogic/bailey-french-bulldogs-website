/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				bailey: {
					50: '#A6882E',
					100: '#735E20',
				}
			}
		},
		keyframes: {
			'open-menu': {
				'0%' : {opacity: '0'},
				'50%' : {opacity: '50'},
				'100%' : {opacity: '100'},
			},			
		},
		animation: {
			'open-menu': 'open-menu .3s ease-in-out forwards',
		}
	},
	plugins: [],
}

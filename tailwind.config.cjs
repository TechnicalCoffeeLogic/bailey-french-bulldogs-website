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
	},
	plugins: [],
}

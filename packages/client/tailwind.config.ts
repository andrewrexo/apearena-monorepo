import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				pixel: ['PixelFont', 'monospace']
			},
			animation: {
				pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				twinkle: 'twinkle 2s infinite'
			},
			keyframes: {
				twinkle: {
					'0%, 100%': { opacity: '0' },
					'50%': { opacity: '1' }
				}
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
			}
		}
	},

	plugins: []
} satisfies Config;

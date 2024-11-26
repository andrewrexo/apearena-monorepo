import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit(),
		tailwindcss(),
		Icons({
			compiler: 'svelte'
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});

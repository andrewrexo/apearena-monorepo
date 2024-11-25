<script lang="ts">
	import Marquee from '$lib/components/marquee.svelte';
	import Particles from '$lib/components/particles.svelte';
	import ThemeControl from '$lib/components/theme-control.svelte';
	import Stats from '$lib/components/stats.svelte';
	import '../app.css';
	import gameClient from '$lib/game/client';
	import { defaultRoom } from '$lib/game/config';
	import { onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import { onNavigate } from '$app/navigation';
	import { themeList } from '$lib/theme';
	import theme, { defaultTheme } from '$lib/state/theme.svelte';
	import Bar from '$lib/components/nav/bar.svelte';
	import Socials from '$lib/components/socials.svelte';

	let { children } = $props();

	let mounted = $state(false);

	onMount(() => {
		if (gameClient.room) {
			return;
		}

		mounted = true;

		gameClient.join(defaultRoom);
	});

	onMount(() => {
		const savedTheme = localStorage.getItem('theme');

		if (savedTheme && themeList.includes(savedTheme)) {
			theme.currentTheme = savedTheme;
			theme.updateThemeColors();
		} else if (!savedTheme) {
			localStorage.setItem('theme', defaultTheme);
		}
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<main
	class="from-primary/50 to-secondary/10 via-secondary/10 min-h-screen overflow-x-hidden bg-gradient-to-br"
>
	<div class="flex min-h-screen flex-col overflow-hidden p-4">
		<Bar />
		<div class="mx-auto flex w-full flex-1 flex-col">
			{@render children()}
		</div>

		<Stats />
		<div
			class="bg-base-300/40 mt-4 flex min-h-[60px] w-full rounded-xl transition-opacity duration-200"
			class:opacity-0={!mounted}
			class:opacity-100={mounted}
		>
			{#if mounted}
				<div class="font-pixel flex w-full items-center justify-between gap-2 p-2 px-6">
					<span class="w-[400px] text-sm" in:fly={{ y: 10, duration: 500 }}>
						join us, your bananas await</span
					>
					<div in:fly={{ y: 20 }} class="-mt-2">
						<Socials />
					</div>
				</div>
			{/if}
		</div>
	</div>
</main>

<style>
	::view-transition-old(root),
	::view-transition-new(root) {
		animation: none;
		mix-blend-mode: normal;
	}

	/* Page content transitions */
	::view-transition-old(page-content) {
		animation:
			150ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
	}

	::view-transition-new(page-content) {
		animation:
			150ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
			300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
	}

	@keyframes morph-to-pull {
		0% {
			transform: scale(1);
			width: 100%;
			max-width: 100%;
			border-radius: 12px;
		}
		50% {
			transform: scale(0.8);
			width: 200px;
			max-width: 95%;
			border-radius: 50px;
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
	}

	@keyframes fade-out {
		to {
			opacity: 0;
		}
	}

	@keyframes slide-from-right {
		from {
			transform: translateX(30px);
		}
	}

	@keyframes slide-to-left {
		to {
			transform: translateX(-30px);
		}
	}
</style>

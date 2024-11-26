<script lang="ts">
	import '../app.css';
	import gameClient from '$lib/game/client';
	import { defaultRoom } from '$lib/game/config';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { themeList } from '$lib/theme';
	import theme, { defaultTheme } from '$lib/state/theme.svelte';
	import Bar from '$lib/components/nav/bar.svelte';
	import Socials from '$lib/components/socials.svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	let isHome = false;

	onMount(() => {
		if (gameClient.room) {
			return;
		}

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
	class="from-primary/10 to-secondary/20 via-secondary/20 min-h-screen overflow-x-hidden bg-linear-to-br px-4 md:px-10"
>
	<div class="flex min-h-screen flex-col space-y-2 p-4">
		<div class="md:h-[38px]" class:h-0={isHome}>
			<Bar />
		</div>
		<div class="mx-auto flex w-full max-w-(--breakpoint-lg) flex-1 flex-col space-y-8">
			{@render children()}
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

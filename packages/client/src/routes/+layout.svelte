<script lang="ts">
	import Particles from '$lib/components/particles.svelte';
	import '../app.css';
	import gameClient from '$lib/game/client';
	import { defaultRoom } from '$lib/game/config';
	import { onMount } from 'svelte';
	import { onNavigate } from '$app/navigation';
	import { themeList } from '$lib/theme';
	import theme, { defaultTheme } from '$lib/state/theme.svelte';
	import Bar from '$lib/components/nav/bar.svelte';
	import Socials from '$lib/components/socials.svelte';

	let { children } = $props();

	let mounted = $state(false);

	onMount(() => {
		mounted = true;

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
	class="from-primary/50 to-secondary/10 via-secondary/10 min-h-screen overflow-x-hidden bg-gradient-to-br"
>
	<Particles />
	<div class="flex min-h-screen flex-col space-y-2 overflow-hidden p-4">
		<div class="h-[90px] duration-500 ease-in-out md:h-[60px]">
			<Bar />
		</div>
		<div class="mx-auto flex w-full max-w-screen-lg flex-1 flex-col overflow-x-hidden">
			{@render children()}
		</div>

		<div class="relative h-[60px] rounded-xl">
			<div
				class="absolute right-1/2 bottom-0 translate-x-1/2 px-4
				py-2 transition-all duration-500 ease-in-out
				lg:right-0 lg:-translate-x-0"
			>
				<Socials />
			</div>
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

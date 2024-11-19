<script lang="ts">
	import Marquee from '$lib/components/marquee.svelte';
	import Particles from '$lib/components/particles.svelte';
	import ThemeControl from '$lib/components/theme-control.svelte';
	import Stats from '$lib/components/stats.svelte';
	import '../app.css';
	import gameClient from '$lib/game/client';
	import { defaultRoom } from '$lib/game/config';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		if (gameClient.room) {
			return;
		}

		gameClient.join(defaultRoom);
	});
</script>

<main
	class="from-primary/50 to-secondary/10 via-secondary/10 min-h-screen overflow-x-hidden bg-gradient-to-br"
>
	<Particles />
	<div class="flex min-h-screen flex-col overflow-hidden p-4">
		<div class="flex flex-col">
			<Marquee />
			<ThemeControl />
		</div>

		<div class="flex flex-1 items-center justify-center">
			<div class="h-[min(320px,90vh)] w-full max-w-4xl md:h-[min(450px,90vh)]">
				{@render children()}
			</div>
		</div>

		<Stats />
	</div>
</main>

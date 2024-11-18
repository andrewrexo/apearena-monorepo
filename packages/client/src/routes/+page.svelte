<script lang="ts">
	import { onMount } from 'svelte';

	import Actions from '$lib/components/actions.svelte';
	import Particles from '$lib/components/particles.svelte';
	import Stats from '$lib/components/stats.svelte';
	import Marquee from '$lib/components/marquee.svelte';
	import ThemeControl from '$lib/components/theme-control.svelte';

	import gameClient from '$lib/game/client';
	import { defaultRoom } from '$lib/game/config';

	onMount(() => {
		gameClient.join(defaultRoom);
	});
</script>

<main
	class="from-primary/50 to-secondary/10 via-secondary/10 relative min-h-screen overflow-hidden bg-gradient-to-br"
>
	<div class="flex h-full min-h-screen w-full flex-col justify-between gap-2 px-6 py-4">
		<div class="flex flex-col gap-2">
			<Marquee />
			<ThemeControl />
		</div>
		<Actions />
		<Stats />
	</div>
</main>

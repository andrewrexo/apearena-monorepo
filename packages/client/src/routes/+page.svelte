<script lang="ts">
	import { onMount } from 'svelte';

	import Actions from '$lib/components/actions.svelte';
	import Particles from '$lib/components/particles.svelte';
	import Stats from '$lib/components/stats.svelte';
	import gameClient from '$lib/game/client';

	onMount(() => {
		gameClient.join('my_room');
	});
</script>

<main
	class="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-black"
>
	<Particles />
	<div
		class="relative z-10 grid h-full min-h-screen grid-cols-1 items-center justify-between gap-10 px-6"
	>
		<Actions />
		<Stats />
	</div>
</main>

<script lang="ts">
	import Actions from '$lib/components/actions.svelte';
	import Carousel from '$lib/components/home/carousel.svelte';
	import { games } from '$lib/game/content';
</script>

<Actions />
<div class="relative">
	<div class="flex flex-col gap-2 p-2">
		<h1 class=" ml-2 text-2xl font-semibold">Play & Earn</h1>
		<Carousel items={games} />
	</div>
</div>

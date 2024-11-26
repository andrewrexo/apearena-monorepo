<script lang="ts">
	import Actions from '$lib/components/actions.svelte';
	import MaterialSymbolsLightHandshake from '~icons/material-symbols-light/handshake';
	import Carousel from '$lib/components/home/carousel.svelte';
	import { games } from '$lib/game/content';
	import Marquee from '$lib/components/marquee.svelte';
</script>

<Actions />
<div class="grid grid-cols-1 gap-8">
	<div class="flex flex-col gap-2">
		<h1 class="ml-2 inline-flex items-center gap-2 text-xl font-semibold">
			<MaterialSymbolsLightHandshake />Play & Earn
		</h1>
		<Carousel items={games} />
	</div>
	<Marquee />
</div>

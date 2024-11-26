<script lang="ts">
	import Actions from '$lib/components/actions.svelte';
	import Chat from '$lib/components/chat.svelte';
	import Carousel from '$lib/components/home/carousel.svelte';
	import Marquee from '$lib/components/marquee.svelte';
	import { games } from '$lib/game/content';
</script>

<Actions />

<div class="grid grid-cols-1 gap-6">
	<div class="flex flex-col gap-2">
		<h1 class="inline-flex items-center gap-2 text-xl">> [on-chain games]</h1>
		<Carousel items={games} />
	</div>
	<div class="space-y-2">
		<h1 class="inline-flex items-center gap-2 text-xl">> [live chat]</h1>
		<Chat />
	</div>
</div>

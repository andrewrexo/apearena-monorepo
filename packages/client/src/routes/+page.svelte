<script lang="ts">
	import Actions from '$lib/components/actions.svelte';
	import Chat from '$lib/components/chat.svelte';
	import Carousel from '$lib/components/home/carousel.svelte';
	import Marquee from '$lib/components/marquee.svelte';
	import { games } from '$lib/game/content';
</script>

<Actions />

<div class="grid grid-cols-1 gap-6 font-mono text-lg">
	<div class="flex flex-col gap-2">
		<h1 class="inline-flex items-center gap-2">> [ games ]</h1>
		<Carousel items={games} />
	</div>
	<div class="block space-y-2 md:hidden">
		<h1 class="inline-flex items-center gap-2">> [live chat]</h1>
		<Chat />
	</div>
</div>

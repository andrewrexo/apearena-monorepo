<script lang="ts">
	import Actions from '$lib/components/actions.svelte';
	import Chat from '$lib/components/chat.svelte';
	import Carousel from '$lib/components/home/carousel.svelte';
	import { games } from '$lib/game/content';
</script>

<Actions />
<div class="grid grid-cols-1 gap-8">
	<div class="flex flex-col gap-2">
		<h1 class="inline-flex items-center gap-2 text-xl text-neutral-300">popular games</h1>
		<Carousel items={games} />
	</div>
	<div class="space-y-2">
		<h1 class="inline-flex items-center gap-2 text-xl text-neutral-300">live chat</h1>
		<Chat />
	</div>
</div>

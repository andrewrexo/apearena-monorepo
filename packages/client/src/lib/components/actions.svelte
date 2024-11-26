<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import Chat from './chat.svelte';

	let mounted = $state(false);
	let scrollY = $state(0);
	let isScrolled = $derived(scrollY > 0);

	onMount(() => {
		mounted = true;
		const updateScroll = () => (scrollY = window.scrollY);
		window.addEventListener('scroll', updateScroll);
		return () => window.removeEventListener('scroll', updateScroll);
	});
</script>

<section class="flex w-full flex-col justify-center gap-12 md:flex-row">
	<div class="logo-container -mb-4 md:min-w-[400px]" class:mounted>
		<div class="min-h-[48px]">
			{#if !isScrolled}
				<h1
					class="animated-title font-pixel ml-2 bg-clip-text text-3xl font-semibold text-transparent"
					in:fly={{ y: 0, duration: 600 }}
					out:fly={{ y: -20, duration: 300 }}
				>
					🦍 ape arena
				</h1>
			{/if}
		</div>
		<span class="text-sm font-medium tracking-wide">
			Play. Earn. Dominate. Powered by $BANANA: token buybacks, burns, and rewards for active
			players—all in on-chain decentralized games.
		</span>
	</div>
	<Chat />
</section>

<script lang="ts">
	import SolarWallet2BoldDuotone from '~icons/solar/wallet-2-bold-duotone';
	import ThemeControl from '../theme-control.svelte';

	let scrollY = $state(0);
	let isScrolled = $derived(scrollY > 0);

	$effect(() => {
		const updateScroll = () => (scrollY = window.scrollY);
		window.addEventListener('scroll', updateScroll);
		return () => window.removeEventListener('scroll', updateScroll);
	});
</script>

<div
	class="nav bg-opacity-50 fixed top-0 right-0 left-0 flex w-full items-center justify-between p-4 px-6 transition-all duration-200 md:px-4"
	class:shadow-lg={isScrolled}
	class:backdrop-blur-sm={isScrolled}
	class:bg-base-100={isScrolled}
	class:px-6={isScrolled}
>
	<div class="flex items-center gap-2">
		{#if isScrolled}
			<h1 class="font-pixel animated-title bg-clip-text text-xl text-transparent">🦍 ape arena</h1>
		{/if}
	</div>
	<div>
		<button
			class="btn btn-sm gap-2 border-none py-0 transition-all duration-200"
			class:bg-opacity-40={!isScrolled}
		>
			<span class="flex items-center gap-2">
				[ connect <SolarWallet2BoldDuotone class="mt-0.5 h-4 w-4" />
				]
			</span>
		</button>
		<ThemeControl isDim={!isScrolled} />
	</div>
</div>

<style>
</style>

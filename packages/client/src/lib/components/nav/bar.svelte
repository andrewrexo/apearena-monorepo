<script lang="ts">
	import SolarWallet2BoldDuotone from '~icons/solar/wallet-2-bold-duotone';
	import SiWalletDuotone from '~icons/si/wallet-duotone';

	let scrollY = $state(0);
	let isScrolled = $derived(scrollY > 0);

	$effect(() => {
		const updateScroll = () => (scrollY = window.scrollY);
		window.addEventListener('scroll', updateScroll);
		return () => window.removeEventListener('scroll', updateScroll);
	});
</script>

<div
	class="nav fixed top-0 right-0 left-0 z-10 flex min-h-[70px] w-full items-center justify-between p-4 px-6 transition-all duration-200 md:hidden md:px-4"
	class:shadow-lg={isScrolled}
	class:backdrop-blur-sm={isScrolled}
	class:bg-base-100={isScrolled}
	class:px-6={isScrolled}
>
	<div class="flex items-center gap-2">
		{#if isScrolled}
			<h1
				class="font-superPixel animated-title mt-1 inline-flex gap-2 bg-clip-text text-xl font-bold text-transparent"
			>
				ape arena
			</h1>
		{/if}
	</div>
	<!-- <div>
		<button
			class="btn btn-sm gap-2 border-none py-0 transition-all duration-200"
			class:bg-opacity-40={!isScrolled}
		>
			<span class="mt-0.5 flex items-center gap-2">
				<SiWalletDuotone class="h-4 w-4" />
			</span>
		</button>
	</div> -->
</div>

<style>
</style>

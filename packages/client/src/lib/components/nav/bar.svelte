<script lang="ts">
	import GameIconsHamburgerMenu from '~icons/game-icons/hamburger-menu';
	import MdiWalletPlus from '~icons/mdi/wallet-plus';
	import ThemeControl from '../theme-control.svelte';

	let scrollY = $state(0);
	let isScrolled = $derived(scrollY > 0);

	// Update scrollY when window scrolls
	$effect(() => {
		const updateScroll = () => (scrollY = window.scrollY);
		window.addEventListener('scroll', updateScroll);
		return () => window.removeEventListener('scroll', updateScroll);
	});
</script>

<div
	class="nav fixed left-0 right-0 top-0 flex w-full items-center justify-between bg-opacity-50 p-2 transition-all duration-200"
	class:shadow-lg={isScrolled}
	class:backdrop-blur-sm={isScrolled}
	class:bg-base-100={isScrolled}
	class:px-4={isScrolled}
>
	<button class="btn md:btn-md btn-sm btn-ghost border-none transition-all duration-200">
		<GameIconsHamburgerMenu />
	</button>

	<div>
		<button
			class="btn md:btn-md btn-sm btn-ghost border-none transition-all duration-200"
			class:btn-neutral={isScrolled}
		>
			<span class="">Connect </span>
			<MdiWalletPlus />
		</button>
	</div>
</div>

<!-- Add spacing to prevent content from hiding under the navbar -->
<div class="h-4"></div>

<style>
	.nav {
		z-index: 100000000;
	}
</style>

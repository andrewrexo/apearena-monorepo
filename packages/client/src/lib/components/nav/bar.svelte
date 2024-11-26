<script lang="ts">
	import GameIconsHamburgerMenu from '~icons/game-icons/hamburger-menu';
	import MdiWalletPlus from '~icons/mdi/wallet-plus';

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
	class="nav bg-opacity-50 fixed top-0 right-0 left-0 flex w-full items-center justify-between p-4 px-6 transition-all duration-200 md:px-4"
	class:shadow-lg={isScrolled}
	class:backdrop-blur-sm={isScrolled}
	class:bg-base-100={isScrolled}
	class:px-6={isScrolled}
>
	<button class="btn md:btn-sm btn-md btn-ghost border-none transition-all duration-200">
		<GameIconsHamburgerMenu />
	</button>

	<div>
		<button
			class="btn md:btn-sm btn-md btn-ghost border-none transition-all duration-200"
			class:btn-neutral={isScrolled}
		>
			<span class="">Connect </span>
			<MdiWalletPlus />
		</button>
	</div>
</div>

<style>
	.nav {
		z-index: 100000000;
	}
</style>

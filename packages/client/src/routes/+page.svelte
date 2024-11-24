<script lang="ts">
	import Actions from '$lib/components/actions.svelte';
	import MaterialSymbolsArrowRightAlt from '~icons/material-symbols/arrow-right-alt';

	let games = [
		{
			title: 'Slot Machine Mania',
			description: 'Spin to win with our animated slot machine!',
			image: '/images/slots.webp',
			link: '/slot',
			tag: 'Popular',
			color: 'primary'
		},
		{
			title: 'Crypto Crash',
			description: 'Watch the multiplier rise and cash out before the crash!',
			image: '/images/crash.webp',
			link: '/games/crash',
			tag: 'Hot',
			color: 'secondary'
		},
		{
			title: 'Pixel Poker',
			description: 'Classic poker with a retro twist.',
			image: '/images/poker.webp',
			link: '/games/poker',
			tag: 'New',
			color: 'accent'
		},
		{
			title: 'Dice Duels',
			description: 'Fast-paced multiplayer dice battles!',
			image: '/images/dice.webp',
			link: '/games/dice',
			tag: 'Multiplayer',
			color: 'info'
		}
	];

	let carouselContainer: HTMLDivElement;

	function scroll(direction: 'left' | 'right') {
		const scrollAmount = 300;
		const targetScroll =
			carouselContainer.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
		carouselContainer.scrollTo({
			left: targetScroll,
			behavior: 'smooth'
		});
	}
</script>

<Actions />

<div class="relative mt-2 flex-1 px-1 md:px-0">
	<!-- Scroll Buttons -->
	<button
		class="btn btn-circle absolute -left-2 top-[40%] z-50 flex items-center justify-center border-none bg-opacity-90 hover:scale-125 hover:bg-opacity-30 md:-left-3"
		aria-label="Scroll left"
		on:click={() => scroll('left')}
	>
		<MaterialSymbolsArrowRightAlt class="h-6 w-6 rotate-180" />
	</button>

	<button
		class="btn btn-circle absolute -right-2 top-[40%] z-50 flex items-center justify-center border-none bg-opacity-90 hover:scale-125 hover:bg-opacity-30 md:-right-3"
		aria-label="Scroll right"
		on:click={() => scroll('right')}
	>
		<MaterialSymbolsArrowRightAlt class="h-6 w-6" />
	</button>

	<!-- Updated Carousel Container -->
	<div
		bind:this={carouselContainer}
		class="scrollbar-hide flex min-h-[300px] w-full snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden pb-4"
	>
		{#each games as game}
			<div
				class="card bg-base-100 image-full min-w-[100%] snap-center shadow-xl transition-all duration-300 md:min-w-[calc((100%-2rem)/3)]"
			>
				{#if game.image}
					<figure>
						<img src={game.image} alt={game.title} class="object-cover" />
					</figure>
				{/if}

				<div class="card-body p-4">
					<div class="flex items-start justify-between">
						<h3 class="card-title text-lg md:text-xl">{game.title}</h3>
						<div class="badge badge-{game.color} badge-sm">{game.tag}</div>
					</div>
					<p class="text-sm">{game.description}</p>
					<div class="card-actions justify-end">
						<a class="btn btn-primary btn-sm" href={game.link}>Play Now</a>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	/* Hide scrollbar but keep functionality */
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>

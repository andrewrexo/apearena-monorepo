<script lang="ts">
	import { games } from '$lib/game/content';
	import MaterialSymbolsArrowRightAlt from '~icons/material-symbols/arrow-right-alt';

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

<button
	class="carousel-button top-[-26%] z-50"
	aria-label="Scroll left"
	onclick={() => scroll('left')}
>
	<MaterialSymbolsArrowRightAlt class="h-6 w-6 rotate-180" />
</button>

<button
	class="carousel-button right-0 top-[-26%] z-50"
	aria-label="Scroll right"
	onclick={() => scroll('right')}
>
	<MaterialSymbolsArrowRightAlt class="h-6 w-6" />
</button>

<div
	bind:this={carouselContainer}
	class="scrollbar-hide flex w-full snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden rounded-xl"
>
	{#each games as game, i}
		<div
			class="card animate-card bg-base-300 image-full max-h-[200px] min-h-[160px] min-w-[100%] snap-center bg-opacity-30 transition-all duration-300 md:max-h-[180px] md:min-w-[calc((100%-2rem)/3)] lg:md:min-w-[calc((100%-2rem)/4)]"
			style="animation-delay: {i * 100}ms"
		>
			{#if game.image}
				<figure>
					<img src={game.image} alt={game.title} class="h-full w-full object-cover" />
				</figure>
			{/if}

			<div class="card-body animate-content p-4" style="animation-delay: {i * 100}ms">
				<div class="flex items-start justify-between">
					<h3 class="card-title md:text-xl">
						{game.title}
					</h3>
					<div class="badge badge-sm">{game.tag}</div>
				</div>
				<p class="text-sm">{game.description}</p>
				<div class="card-actions justify-end">
					<a class="btn btn-sm border-none bg-opacity-40" href={game.link}>Play Now</a>
				</div>
			</div>
		</div>
	{/each}
</div>

<style lang="postcss">
	/* Hide scrollbar but keep functionality */
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	.carousel-button {
		@apply btn btn-sm absolute z-50 hidden items-center justify-center border-none bg-opacity-30 hover:scale-105 hover:bg-opacity-60 active:bg-opacity-30 md:flex;

		animation-delay: 300ms;
	}

	@keyframes scaleIn {
		from {
			transform: scale(0.1);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.animate-card {
		animation: cardIn 0.3s cubic-bezier(0.075, 0.82, 0.165, 1) forwards;
		opacity: 0;
		transform: scale(0.5);
	}

	.animate-content {
		animation: cardIn 0.4s cubic-bezier(0.77, 0, 0.175, 1) forwards;
		opacity: 0;
		transform: scale(0.8);
	}

	@keyframes cardIn {
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes fadeIn {
		to {
			opacity: 1;
		}
	}
</style>

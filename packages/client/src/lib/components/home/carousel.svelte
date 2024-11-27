<script lang="ts">
	import { goto } from '$app/navigation';
	import { images } from '$lib/images';
	import PointerIcon from '~icons/ph/cursor-click-fill';
	import FingerTapIcon from '~icons/streamline/one-finger-tap';

	let { items }: { items: any[] } = $props();

	const carouselItemClick = (item: any) => {
		// todo: navigate to other games
		setTimeout(() => {
			goto('/slot');
		}, 100);
	};
</script>

{#snippet GameCard({ item, i }: { item: any; i: number })}
	<div class="card-body cursor-pointer p-3 text-sm">
		<h3 class="btn btn-sm w-fit justify-start rounded-lg text-left">
			{item.title}
		</h3>

		<div class="card-actions absolute right-2 bottom-2 justify-end">
			<button class="btn btn-sm bg-opacity-80">
				Play
				<PointerIcon class="hidden h-3 w-3 md:block" />
				<FingerTapIcon class="h-3 w-3 md:hidden" />
			</button>
		</div>
	</div>
{/snippet}

<div class="mt-auto w-full">
	<section class="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
		{#each items as item, i}
			<div
				onclick={() => carouselItemClick(item)}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						carouselItemClick(item);
					}
				}}
				role="button"
				tabindex="0"
				class="card bg-base-300/50 h-[140px] overflow-hidden shadow-lg transition-all duration-200 active:scale-95"
			>
				<enhanced:img
					src={images[item.image]}
					alt={item.title}
					class="h-full w-full overflow-hidden object-cover"
					loading="eager"
				/>
				{@render GameCard({ item, i })}
			</div>
		{/each}
	</section>
</div>

<style>
	.card {
		display: grid;
	}
	.card:before {
		position: relative;
		content: '';
		z-index: 5;
		border-radius: var(--rounded-box, 1rem);
		opacity: 0.5;
		background-color: var(--fallback-n, oklch(var(--n) / 0.5));
	}
	.card:before,
	.card > * {
		grid-column-start: 1;
		grid-row-start: 1;
	}
	.card:before,
	.card > * {
		grid-column-start: 1;
		grid-row-start: 1;
	}
	picture {
		overflow: hidden;
	}
	.card > .card-body {
		position: relative;
		z-index: 5;
		--tw-text-opacity: 1;
		color: var(--fallback-nc, oklch(var(--nc) / var(--tw-text-opacity)));
	}
</style>

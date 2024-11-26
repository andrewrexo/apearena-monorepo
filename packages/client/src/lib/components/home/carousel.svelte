<script lang="ts">
	import { images } from '$lib/images';
	import { onMount } from 'svelte';
	import PointerIcon from '~icons/material-symbols/arrow-selector-tool-rounded';
	import FingerTapIcon from '~icons/streamline/one-finger-tap';

	let { items }: { items: any[] } = $props();

	let isMobile = $state(typeof window !== 'undefined' && window.innerWidth < 768);

	let carouselElement: HTMLElement;

	$effect(() => {
		console.log(images);
	});

	const preserveScroll = () => {
		if (!carouselElement) return;
		const scrollLeft = carouselElement.scrollLeft;
		requestAnimationFrame(() => {
			carouselElement.scrollLeft = scrollLeft;
		});
	};
</script>

<svelte:window
	on:resize={() => {
		if (window.innerWidth < 768 && !isMobile) {
			isMobile = true;
		} else if (window.innerWidth >= 768 && isMobile) {
			isMobile = false;
		}
		preserveScroll();
	}}
/>

{#snippet GameCard({ item, i }: { item: any; i: number })}
	<div class="card-body p-3 text-sm text-neutral-100">
		<h3 class="btn btn-sm no-animation w-fit cursor-auto justify-start rounded-lg text-left">
			{item.title}
		</h3>

		<div class="card-actions absolute right-2 bottom-2 justify-end">
			<a class="btn btn-sm bg-opacity-80" href={item.link}>
				Play
				{#if !isMobile}
					<PointerIcon class="h-3 w-3" />
				{:else}
					<FingerTapIcon class="h-3 w-3" />
				{/if}
			</a>
		</div>
	</div>
{/snippet}

<div class="mt-auto w-full">
	<section class="hidden gap-2 md:grid md:grid-cols-3 lg:grid-cols-4">
		{#each items as item, i}
			<div class="card bg-base-300/50 h-[140px] overflow-hidden shadow-lg">
				<enhanced:img
					src={images[item.image]}
					alt={item.title}
					class="h-full w-full object-cover"
					loading="eager"
				/>
				{@render GameCard({ item, i })}
			</div>
		{/each}
	</section>

	<section
		bind:this={carouselElement}
		class="grid w-full grid-cols-1 gap-4 space-x-8 shadow-lg md:hidden"
	>
		{#each items as item, i}
			<div class="carousel-item w-full" id={`game-${i}`}>
				<div class="card bg-base-300/50 h-[180px] w-full overflow-hidden">
					{#if item.image}
						<enhanced:img
							src={images[item.image]}
							alt={item.title}
							class="h-full w-full object-cover"
							loading="eager"
						/>
					{/if}
					{@render GameCard({ item, i })}
				</div>
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
		opacity: 0.75;
		background-color: var(--fallback-n, oklch(var(--n) / 0.7));
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

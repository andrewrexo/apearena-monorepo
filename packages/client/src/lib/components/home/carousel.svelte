<script lang="ts">
	import { onMount } from 'svelte';
	import PointerIcon from '~icons/material-symbols/arrow-selector-tool-rounded';
	import FingerTapIcon from '~icons/streamline/one-finger-tap';

	let { items }: { items: any[] } = $props();

	let isMobile = $state(typeof window !== 'undefined' && window.innerWidth < 768);
	let isMounted = $state(false);

	let carouselElement: HTMLElement;

	const preserveScroll = () => {
		if (!carouselElement) return;
		const scrollLeft = carouselElement.scrollLeft;
		requestAnimationFrame(() => {
			carouselElement.scrollLeft = scrollLeft;
		});
	};

	onMount(() => (isMounted = true));
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
		<h3
			class="btn btn-ghost btn-sm no-animation w-fit cursor-auto justify-start rounded-lg text-left text-neutral-300"
		>
			{item.title}
		</h3>
		<div class="flex-1"></div>
		<div class="card-actions justify-end">
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
			<div
				class="card bg-base-300 h-[140px] shadow-lg transition-all duration-300"
				style="animation-delay: {i * 100}ms"
			>
				{#if item.image}
					<figure>
						<img
							src={item.image}
							alt={item.title}
							class="h-full w-full object-cover"
							loading="eager"
						/>
					</figure>
				{/if}
				{@render GameCard({ item, i })}
			</div>
		{/each}
	</section>

	<section
		bind:this={carouselElement}
		class="carousel rounded-box w-full space-x-8 shadow-lg md:hidden"
	>
		{#each items as item, i}
			<div class="carousel-item w-full" id={`game-${i}`}>
				<div class="card bg-base-300 h-[180px] w-full">
					{#if item.image}
						<figure>
							<img
								src={item.image}
								alt={item.title}
								class="h-full w-full object-cover"
								loading="lazy"
							/>
						</figure>
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
		z-index: 10;
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
	.card > figure img {
		height: 100%;
		object-fit: cover;
	}
	.card > .card-body {
		position: relative;
		z-index: 20;
		--tw-text-opacity: 1;
		color: var(--fallback-nc, oklch(var(--nc) / var(--tw-text-opacity)));
	}
	.card :where(figure) {
		overflow: hidden;
		border-radius: inherit;
	}
</style>

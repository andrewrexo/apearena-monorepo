<script lang="ts">
	let { items }: { items: any[] } = $props();
	let carouselElement: HTMLElement;

	$effect(() => {
		if (typeof window === 'undefined') return;

		const preserveScroll = () => {
			if (!carouselElement) return;
			const scrollLeft = carouselElement.scrollLeft;
			requestAnimationFrame(() => {
				carouselElement.scrollLeft = scrollLeft;
			});
		};

		window.addEventListener('resize', preserveScroll);
		return () => window.removeEventListener('resize', preserveScroll);
	});
</script>

{#snippet GameCard({ item, i }: { item: any; i: number })}
	<div class="card-body animate-content p-5" style="animation-delay: {i}ms">
		<div class="flex items-start justify-between">
			<h3 class="card-title md:text-xl">{item.title}</h3>
			<div class="badge badge-sm">{item.tag}</div>
		</div>
		<p class="text-sm">{item.description}</p>
		<div class="card-actions justify-end">
			<a class="btn btn-sm bg-opacity-40 border-none" href={item.link}> Play Now </a>
		</div>
	</div>
{/snippet}

<div class="mt-auto w-full">
	<section class="hidden gap-2 md:grid md:grid-cols-3 lg:grid-cols-4">
		{#each items as item, i}
			<div
				class="card bg-base-300 image-full bg-opacity-30 h-[180px] shadow-lg transition-all duration-300"
				style="animation-delay: {i * 100}ms"
			>
				{#if item.image}
					<figure>
						<img
							src={item.image}
							alt={item.title}
							class="h-full w-full object-cover brightness-125"
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
				<div class="card bg-base-300 image-full bg-opacity-30 max-h-[240px] min-h-[160px] w-full">
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

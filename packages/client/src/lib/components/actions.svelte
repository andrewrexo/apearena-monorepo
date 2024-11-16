<script lang="ts">
	let hoveredButton = $state(false);
</script>

<section class="flex flex-1 flex-col items-center justify-center py-12">
	<span class="mb-8 flex flex-col items-center gap-8 md:flex-row">
		<h1
			class="animated-title font-pixel transform cursor-default select-none bg-clip-text text-center text-8xl font-extrabold uppercase text-transparent transition-transform hover:scale-105"
		>
			ape arena
		</h1>
		<p class="animate-bounce cursor-default text-7xl text-neutral-300 md:-mr-12">🍌</p>
	</span>

	<a href="/play">
		<button
			onmouseenter={() => (hoveredButton = true)}
			onmouseleave={() => (hoveredButton = false)}
			class="btn-lg btn-wide from-primary to-secondary group relative transform rounded-xl bg-gradient-to-r font-bold
         text-white transition-all duration-300
         hover:scale-105 hover:text-white hover:shadow-2xl"
		>
			{#if hoveredButton}
				<span class="text-2xl">🍌🍌🍌🍌🍌</span>
				<div class="absolute inset-0 animate-pulse rounded-xl bg-white opacity-20"></div>
			{:else}
				ENTER THE ARENA
			{/if}
		</button>
	</a>
</section>

<style lang="postcss">
	.animated-title {
		background-image: linear-gradient(
			-60deg,
			theme(colors.primary) 0%,
			theme(colors.primary) 20%,
			theme(colors.secondary) 40%,
			theme(colors.secondary) 60%,
			theme(colors.primary) 80%,
			theme(colors.primary) 100%
		);
		background-size: 300% auto;
		animation: shine 4s linear infinite;
	}

	@keyframes shine {
		to {
			background-position: 300% center;
		}
	}
</style>

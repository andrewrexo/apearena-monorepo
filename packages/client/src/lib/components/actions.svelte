<script lang="ts">
	let hoveredButton = $state(false);
</script>

<section class="flex h-[300px] flex-col items-center justify-center md:h-[260px]">
	<div class="mb-8 transform text-center transition-transform hover:scale-105">
		<h1
			class="title-gradient font-pixel pointer-events-none bg-clip-text text-8xl font-extrabold uppercase text-transparent"
		>
			ape arena
		</h1>
	</div>

	<a href="/play">
		<button
			onmouseenter={() => (hoveredButton = true)}
			onmouseleave={() => (hoveredButton = false)}
			class="btn-lg btn-wide from-primary to-secondary group relative transform rounded-xl bg-gradient-to-r font-bold
         text-white transition-all duration-300
         hover:scale-105 hover:text-white hover:shadow-2xl"
		>
			ENTER THE ARENA
			{#if hoveredButton}
				<div class="absolute inset-0 animate-pulse rounded-xl bg-white opacity-20"></div>
			{/if}
		</button>
	</a>
</section>

<style lang="postcss">
	.title-gradient {
		@apply from-warning via-secondary to-secondary bg-gradient-to-r;
	}
</style>

<script lang="ts">
	let hoveredButton = $state(false);
</script>

<div class="mb-12 transform text-center transition-transform hover:scale-105">
	<h1
		class="title-gradient pointer-events-none mb-4 bg-clip-text text-8xl font-extrabold uppercase text-transparent"
	>
		ape arena
	</h1>
	<p class="pointer-events-none mt-4 text-xl text-yellow-100">the battle for banana supremacy</p>
</div>

<button
	onmouseenter={() => (hoveredButton = true)}
	onmouseleave={() => (hoveredButton = false)}
	class="group relative mb-8 transform rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500
       px-8 py-4 transition-all duration-300 hover:scale-105
       hover:shadow-[0_0_30px_rgba(255,165,0,0.5)]"
>
	ENTER THE ARENA
	{#if hoveredButton}
		<div class="absolute inset-0 animate-pulse rounded-xl bg-white opacity-20"></div>
	{/if}
</button>

<div class="mt-8 grid grid-cols-2 gap-6">
	<a
		href="/leaderboard"
		class="rounded-lg bg-yellow-500 bg-opacity-10 px-6 py-3 text-center
        text-yellow-100 transition-all hover:bg-opacity-20"
	>
		🏆 Leaderboard
	</a>
	<a
		href="/how-to-play"
		class="rounded-lg bg-yellow-500 bg-opacity-10 px-6 py-3 text-center
        text-yellow-100 transition-all hover:bg-opacity-20"
	>
		📖 How to Play
	</a>
</div>

<style lang="postcss">
	.title-gradient {
		@apply bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600;
	}
</style>

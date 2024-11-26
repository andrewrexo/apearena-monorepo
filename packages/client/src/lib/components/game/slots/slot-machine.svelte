<script lang="ts">
	import Reel2D from './reel-2d.svelte';

	const symbols = ['🍌', '💎', '7️⃣', '🎲', '🔥'];
	let isSpinning = $state(false);

	function spinAllReels(targetCombination: number[]) {
		if (isSpinning) return;
		isSpinning = true;

		targetCombination.forEach((target, i) => {
			setTimeout(() => {
				(window as any)[`spinReel${i}`](target);
			}, i * 200); // Stagger the spin start of each reel
		});

		setTimeout(() => {
			isSpinning = false;
		}, 2500); // Total spin duration + slight delay
	}

	// Test spin with random results
	function spinRandom() {
		const randomTargets = Array(3)
			.fill(0)
			.map(() => Math.floor(Math.random() * symbols.length));
		spinAllReels(randomTargets);
	}
</script>

<div class="flex w-full justify-center">
	<div class="grid grid-cols-3 gap-4">
		{#each Array(3) as _, i}
			<Reel2D {symbols} column={i} symbolHeight={100} visibleSymbols={3} />
		{/each}
	</div>
</div>

<button class="btn btn-wide mt-12" onclick={spinRandom} disabled={isSpinning}>
	{isSpinning ? 'Spinning...' : 'Spin'}
</button>

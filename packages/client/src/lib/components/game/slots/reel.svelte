<script lang="ts">
	import { T } from '@threlte/core';
	import Symbol from './symbol.svelte';

	let { reels = [], radius = 1, symbolCount = 5, epsilon = 0.1 } = $props();

	const angleStep = (Math.PI * 2) / symbolCount;

	function getVisibleSymbol(reel: any, index: number, reelIndex: number) {
		const currentPosition = Math.floor(reel.position);
		const symbolIndex = (-index + currentPosition + symbolCount) % symbolCount;

		console.log(`Reel ${reelIndex} pos ${currentPosition} index ${index} -> symbol ${symbolIndex}`);
		return reel.symbols[symbolIndex];
	}
</script>

{#each reels as reel, i}
	<T.Group position.x={(i - 1) * 2}>
		<T.Group rotation.x={reel.position * angleStep}>
			{#each Array(symbolCount) as _, j}
				{@const angle = j * angleStep}
				<T.Group
					position.y={radius * Math.sin(-angle)}
					position.z={radius * Math.cos(-angle)}
					rotation.x={angle}
				>
					<Symbol symbol={getVisibleSymbol(reel, j, i)} />
				</T.Group>
			{/each}
		</T.Group>
	</T.Group>
{/each}

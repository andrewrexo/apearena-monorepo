<script lang="ts">
	import { T } from '@threlte/core';
	import Symbol from './symbol.svelte';

	let { reels, symbols, radius, epsilon } = $props();

	let angleBase = $derived((2 * Math.PI) / symbols);

	function getSymbolPosition(basePosition: number, index: number) {
		const angle = (basePosition + index) * angleBase;
		return {
			x: 0,
			y: radius * Math.sin(angle),
			z: radius * Math.cos(angle),
			rotation: -angle,
			scale: 1
		};
	}
</script>

{#each reels as reel, i}
	<T.Group position.x={(i - 1) * 1.5}>
		<T.Group rotation.x={reel.position * angleBase}>
			{#each reel.symbols as symbol, j}
				{@const pos = getSymbolPosition(0, j)}
				<T.Group position.y={pos.y} position.z={pos.z} rotation.x={pos.rotation}>
					<Symbol {symbol} />
				</T.Group>
			{/each}
		</T.Group>
	</T.Group>
{/each}

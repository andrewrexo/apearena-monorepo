<script lang="ts">
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';

	interface ReelProps {
		symbolHeight?: number;
		visibleSymbols?: number;
		symbols: string[];
		column?: number;
	}

	let { symbolHeight, visibleSymbols, symbols, column }: ReelProps = $props();

	let reelSymbols = $state<string[]>([]);
	let isSpinning = $state(false);
	let currentPosition = $state(0);
	let targetPosition = $state(0);
	let spinDuration = $state(2000);
	let reelContainer: HTMLDivElement;
	let isMounted = $state(false);

	const SYMBOL_HEIGHT = symbolHeight ?? 100;
	const VISIBLE_SYMBOLS = visibleSymbols ?? 3;
	const SETS_OF_SYMBOLS = 10;

	function initializeReel() {
		reelSymbols = Array(SETS_OF_SYMBOLS).fill(symbols).flat();

		const middleSet = Math.floor(SETS_OF_SYMBOLS / 2);
		currentPosition = middleSet * symbols.length * SYMBOL_HEIGHT;

		if (reelContainer) {
			reelContainer.style.setProperty('--translate-y', `-${currentPosition}px`);
			reelContainer.style.transition = 'none';
		}
	}

	function spinToIndex(targetIndex: number) {
		if (isSpinning) return;
		isSpinning = true;

		const symbolSetHeight = symbols.length * SYMBOL_HEIGHT;
		const middleSet = Math.floor(SETS_OF_SYMBOLS / 2);
		const basePosition = middleSet * symbolSetHeight;

		const rotations = Math.floor(Math.random() * 2) + 2;
		const additionalSpins = rotations * symbolSetHeight;

		targetPosition = basePosition + additionalSpins + targetIndex * SYMBOL_HEIGHT;

		reelContainer.offsetHeight;

		reelContainer.style.transition = `transform ${spinDuration}ms cubic-bezier(0.5, 0.1, 0.15, 1.0)`;
		reelContainer.style.transform = `translateY(-${targetPosition}px)`;

		setTimeout(() => {
			isSpinning = false;
			currentPosition = basePosition + targetIndex * SYMBOL_HEIGHT;

			reelContainer.style.transition = 'none';
			reelContainer.style.transform = `translateY(-${currentPosition}px)`;
		}, spinDuration);
	}

	onMount(() => {
		isMounted = true;

		initializeReel();
	});

	$effect.root(() => {
		if (typeof window !== 'undefined') {
			(window as any)[`spinReel${column}`] = spinToIndex;
		}
	});
</script>

{#if isMounted}
	<div
		class="reel-boss flex overflow-hidden rounded-xl will-change-transform"
		style:height="{VISIBLE_SYMBOLS * SYMBOL_HEIGHT}px"
		style:width="{SYMBOL_HEIGHT}px"
		in:scale={{ start: 0.2 }}
	>
		<div class="reel-container" bind:this={reelContainer}>
			{#each reelSymbols as symbol, i (i)}
				<div
					class="bg-primary bg-opacity-30 flex items-center justify-center"
					style:height="{SYMBOL_HEIGHT}px"
					style:width="{SYMBOL_HEIGHT}px"
				>
					<span class="symbol-content transition-all duration-300" class:mounted={isMounted}>
						{symbol}
					</span>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.symbol-content.mounted {
		transform: scale(1);
	}

	.symbol-content {
		font-size: 3rem;
		transform: scale(0.5);
		line-height: 1;
	}

	.reel-container {
		will-change: transform;
	}
</style>

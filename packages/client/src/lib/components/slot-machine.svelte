<script lang="ts">
	import { Canvas } from '@threlte/core';
	import SlotMachineScene from './slot-machine-scene.svelte';
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';

	let spinning = $state(false);
	let mounted = $state(false);

	const SYMBOLS = ['🍌', '💎', '🔥', '🎰', '🎲'];
	const SYMBOL_COUNT = 5;
	const SPIN_SPEED = 15;
	const SPIN_TIME = 2000;
	const SPIN_DELAY = 500;

	type Reel = {
		symbols: string[];
		position: number;
		speed: number;
		targetPosition: number;
		spinDuration: number;
	};

	// Step 1: Generate a random result first
	function generateSpinResult() {
		return Array(3)
			.fill(0)
			.map(() => Math.floor(Math.random() * SYMBOL_COUNT));
	}

	// Step 2: Create a reel that will land on our target symbol
	function createReelForTarget(targetIndex: number) {
		// Create a reel array that puts our target symbol at position 0
		const reel = [...SYMBOLS];
		// Rotate array so target symbol is at position 0
		while (reel[0] !== SYMBOLS[targetIndex]) {
			reel.push(reel.shift()!);
		}
		return reel;
	}

	let reels = $state([
		{ symbols: SYMBOLS, position: 0, speed: 0, targetPosition: 0, spinDuration: 0 },
		{ symbols: SYMBOLS, position: 0, speed: 0, targetPosition: 0, spinDuration: 0 },
		{ symbols: SYMBOLS, position: 0, speed: 0, targetPosition: 0, spinDuration: 0 }
	] as Reel[]);

	let winAmount = $state(0);
	let betAmount = $state(100);
	let balance = $state(1000);
	let showParticles = $state(false);

	let sceneActions = $state({
		shakeCamera: (intensity: number) => {},
		spawnWinParticles: (multiplier: number) => {},
		spawnMultiplierTrail: (multiplier: number) => {}
	});

	function spin() {
		if (spinning || balance < betAmount) return;

		spinning = true;
		balance -= betAmount;
		showParticles = false;

		// Step 1: Determine the final result
		const spinResult = generateSpinResult();
		console.log('Spin result indices:', spinResult);
		console.log(
			'Target symbols:',
			spinResult.map((i) => SYMBOLS[i])
		);

		// Step 2: Create reels that will land on these symbols
		reels = reels.map((_, i) => {
			const spinDuration = SPIN_TIME + i * SPIN_DELAY;
			const targetSymbolIndex = spinResult[i];
			const newSymbols = createReelForTarget(targetSymbolIndex);

			// Each reel does 4 complete rotations plus its index (for staggered effect)
			const completeRotations = 4 + i;
			const targetPosition = completeRotations * SYMBOL_COUNT;

			return {
				symbols: newSymbols,
				position: 0,
				speed: SPIN_SPEED,
				targetPosition,
				spinDuration
			};
		});

		// Stop each reel at its designated time
		reels.forEach((reel, i) => {
			setTimeout(() => {
				reels = reels.map((r, index) =>
					index === i ? { ...r, position: r.targetPosition, speed: 0 } : r
				);

				if (i === reels.length - 1) {
					checkWin();
					spinning = false;
				}
			}, reel.spinDuration);
		});
	}

	function checkWin() {
		// Simply check position 0 of each reel's symbols array
		const positions = reels.map((reel) => reel.symbols[0]);
		console.log('Final symbols:', positions);

		if (positions.every((pos) => pos === positions[0])) {
			winAmount = betAmount * 10;
			balance += winAmount;
			showParticles = true;
			sceneActions.shakeCamera(0.8);
			sceneActions.spawnWinParticles(10);
			sceneActions.spawnMultiplierTrail(10);
		} else if (positions[0] === positions[1] || positions[1] === positions[2]) {
			winAmount = betAmount * 2;
			balance += winAmount;
			showParticles = true;
			sceneActions.shakeCamera(0.3);
			sceneActions.spawnWinParticles(2);
			sceneActions.spawnMultiplierTrail(2);
		} else {
			winAmount = 0;
		}
	}

	onMount(() => {
		mounted = true;
	});
</script>

<div class="mb-4 flex h-full w-full flex-col md:mb-8">
	{#if mounted}
		<div
			class="relative flex h-full w-full flex-col"
			in:scale={{ duration: 300, start: 0.5 }}
			out:scale={{ duration: 300, start: 0.1 }}
		>
			<div class="relative max-h-[400px] flex-1">
				<div class="absolute inset-0">
					<Canvas>
						<SlotMachineScene {reels} {spinning} {showParticles} bind:sceneActions />
					</Canvas>
				</div>
			</div>
		</div>
		<button
			in:scale={{ duration: 300 }}
			out:scale={{ duration: 300 }}
			onclick={spin}
			disabled={spinning || balance < betAmount}
			class="btn-block btn from-primary to-secondary transition-position no-animation z-10 mx-auto mb-4
				flex max-w-[95%] rounded-full bg-gradient-to-r py-4
				font-bold
				text-neutral-100 shadow-[0_0_15px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]
				hover:text-white hover:shadow-[0_0_25px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] active:scale-[0.98]
				active:shadow-inner disabled:cursor-not-allowed
				disabled:opacity-50 md:w-[400px]"
		>
			{spinning ? 'Spinning...' : `PULL`}
		</button>
	{:else}
		<div class="flex flex-1 items-center justify-center">
			<span class="loading loading-lg loading-dots text-primary"></span>
		</div>
	{/if}
</div>

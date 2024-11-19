<script lang="ts">
	import { Canvas } from '@threlte/core';
	import SlotMachineScene from './slot-machine-scene.svelte';
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';

	let spinning = $state(false);
	let mounted = $state(false);
	let reels = $state([
		{
			symbols: ['🍌', '💎', '🔥', '🎰', '🎲', '🍎', '🍇', '🚀'],
			position: 0,
			speed: 0,
			targetPosition: 0
		},
		{
			symbols: ['💎', '🚀', '🍌', '🍇', '🍉', '🎲', '🎰', '🔥'],
			position: 0,
			speed: 0,
			targetPosition: 0
		},
		{
			symbols: ['🚀', '🎰', '💎', '🍇', '🎲', '🍉', '🔥', '🍌'],
			position: 0,
			speed: 0,
			targetPosition: 0
		}
	]);

	let winAmount = $state(0);
	let betAmount = $state(100);
	let balance = $state(1000);
	let showParticles = $state(false);

	const SPIN_SPEED = 10;
	const BASE_SPINS = 2;
	const STOP_DURATION = 2800;
	const SYMBOL_COUNT = 5;

	function handleSpin() {
		if (spinning || balance < betAmount) return;

		spin();
	}

	function spin() {
		if (spinning || balance < betAmount) return;

		spinning = true;
		balance -= betAmount;
		showParticles = false;

		const randomStops = Array(3)
			.fill(0)
			.map(() => Math.floor(Math.random() * SYMBOL_COUNT));

		reels = reels.map((reel, i) => {
			const baseSpins = BASE_SPINS * SYMBOL_COUNT;
			const extraSpins = i * 3 * SYMBOL_COUNT;
			const exactTargetPosition = baseSpins + extraSpins + randomStops[i];

			return {
				...reel,
				speed: SPIN_SPEED,
				targetPosition: exactTargetPosition,
				position: reel.position,
				stopTime: undefined
			};
		});

		setTimeout(() => {
			checkWin();
			spinning = false;
		}, STOP_DURATION);
	}

	function checkWin() {
		const positions = reels.map((reel) => {
			const normalizedPosition = Math.round(reel.position) % SYMBOL_COUNT;
			return reel.symbols[normalizedPosition];
		});

		if (positions.every((pos) => pos === positions[0])) {
			winAmount = betAmount * 10;
			balance += winAmount;
			showParticles = true;
		} else if (positions[0] === positions[1] || positions[1] === positions[2]) {
			winAmount = betAmount * 2;
			balance += winAmount;
			showParticles = true;
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
						<SlotMachineScene {reels} spinning={true} {showParticles} />
					</Canvas>
				</div>
			</div>
		</div>
		<button
			in:scale={{ duration: 300 }}
			out:scale={{ duration: 300 }}
			onclick={handleSpin}
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

<script lang="ts">
	import { Canvas } from '@threlte/core';
	import SlotMachineScene from './slot-machine-scene.svelte';
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';

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

	const SPIN_SPEED = 5;
	const BASE_SPINS = 2;
	const REEL_DELAY = 100;
	const STOP_DURATION = 5000;

	let pullArm: () => void = $state(() => {});

	function handleSpin() {
		if (spinning || balance < betAmount) return;

		pullArm();
		setTimeout(() => {
			spin();
		}, 300);
	}

	function spin() {
		if (spinning || balance < betAmount) return;

		spinning = true;
		balance -= betAmount;
		showParticles = false;

		reels = reels.map((reel, i) => {
			const randomStops = Math.floor(Math.random() * 5);
			const extraSpins = i * 4;
			const targetPosition = (BASE_SPINS + extraSpins) * 5 + randomStops;

			return {
				...reel,
				speed: SPIN_SPEED,
				targetPosition: Math.round(targetPosition),
				position: 0
			};
		});

		const initiateReelStop = (index: number) => {
			if (index < reels.length) {
				reels[index].speed = SPIN_SPEED * 0.3;
			}
		};

		reels.forEach((_, index) => {
			setTimeout(() => initiateReelStop(index), REEL_DELAY * 1);
		});

		const totalDuration = REEL_DELAY * reels.length + STOP_DURATION;
		setTimeout(() => {
			checkWin();
			spinning = false;
		}, totalDuration);
	}

	function checkWin() {
		const positions = reels.map((reel) => {
			const finalPosition = Math.round(reel.position) % 5;
			return reel.symbols[finalPosition];
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
						<SlotMachineScene {reels} spinning={true} {showParticles} bind:pullArm />
					</Canvas>
				</div>
			</div>
		</div>
		<button
			in:scale={{ duration: 300 }}
			out:scale={{ duration: 300 }}
			onclick={handleSpin}
			disabled={spinning || balance < betAmount}
			class="btn-block no-animation btn from-primary to-secondary z-10 mx-auto flex max-w-[90%]
            rounded-2xl bg-gradient-to-r py-4 font-bold text-neutral-100 shadow-md transition-all hover:text-white hover:shadow-2xl active:scale-105 active:shadow-2xl
            disabled:text-neutral-200 md:w-[300px]"
		>
			{spinning ? 'Spinning...' : `PULL for ${betAmount} `}
			<span>🎰</span>
		</button>
	{:else}
		<div class="flex flex-1 items-center justify-center">
			<span class="loading loading-lg loading-dots text-primary"></span>
		</div>
	{/if}
</div>

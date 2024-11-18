<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { fade } from 'svelte/transition';
	import SlotMachineScene from './slot-machine-scene.svelte';

	let spinning = $state(false);
	let reels = $state([
		{ symbols: ['🍌', '💎', '🚀', '🎰', '🎲'], position: 0, speed: 0, targetPosition: 0 },
		{ symbols: ['💎', '🚀', '🍌', '🎲', '🎰'], position: 0, speed: 0, targetPosition: 0 },
		{ symbols: ['🚀', '🎰', '💎', '🍌', '🎲'], position: 0, speed: 0, targetPosition: 0 }
	]);

	let winAmount = $state(0);
	let betAmount = $state(100);
	let balance = $state(1000);
	let showParticles = $state(false);

	const SPIN_SPEED = 5;
	const BASE_SPINS = 1;
	const REEL_DELAY = 200;
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
</script>

<div class="relative flex h-[400px] w-full items-center justify-center">
	<Canvas>
		<SlotMachineScene {reels} spinning={true} {showParticles} bind:pullArm />
		<ambientLight intensity={0.8} />
		<pointLight position={[0, 5, 5]} intensity={1} distance={20} color="#ff9900" />
		<pointLight position={[-5, 0, 5]} intensity={0.5} distance={15} color="#ff0000" />
	</Canvas>

	<div class="absolute bottom-8 flex w-full flex-col items-center gap-4 md:max-w-[300px]">
		<button
			onclick={handleSpin}
			disabled={spinning || balance < betAmount}
			class="btn-block from-primary to-secondary flex transform cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r py-4 font-bold
         text-neutral-100 shadow-md transition-all
         duration-300 hover:text-white hover:shadow-2xl active:scale-105 active:shadow-2xl"
			class:btn-disabled={spinning || balance < betAmount}
			class:bg-opacity-50={spinning || balance < betAmount}
		>
			{spinning ? 'Spinning...' : 'PULL ARM'}
		</button>
	</div>
</div>

<style>
	canvas {
		image-rendering: pixelated;
	}
</style>

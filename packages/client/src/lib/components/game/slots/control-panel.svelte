<script lang="ts">
	import { fly } from 'svelte/transition';

	let { spin }: { spin: () => void } = $props();

	let spinning = $state(false);
	let bet = $state(100);
	let balance = $state(1000);
	let favorites = $state([0.01, 0.02, 0.5, 1]);
	let recentResults = $state([
		{ amount: 0.01, win: true },
		{ amount: 0.02, win: false },
		{ amount: 0.05, win: true }
	]);

	const handleSpin = () => {
		spinning = true;
		spin();
	};

	$effect(() => {
		if (spinning) {
			const timeout = setTimeout(() => {
				spinning = false;
			}, 3000);

			return () => clearTimeout(timeout);
		}
	});
</script>

<div
	class="bg-base-300 z-50 flex w-full flex-col gap-4 rounded-lg bg-opacity-30 p-4 md:mb-0"
	in:fly={{ y: 10, duration: 500 }}
>
	<div class="font-pixel flex items-center justify-between">
		<div class="flex flex-col">
			<span class="text-xs opacity-70">Bet Amount</span>
			<span class="text-xl font-bold">{bet}</span>
		</div>
		<div class=" absolute left-1/2 -translate-x-1/2 text-2xl font-bold uppercase">Slot Mania</div>
		<div class="flex flex-col items-end">
			<span class="text-xs opacity-70">Balance</span>
			<span class="text-xl font-bold">{balance}</span>
		</div>
	</div>

	<button class="btn btn-primary w-full" class:btn-disabled={spinning} onclick={() => handleSpin()}>
		{#if spinning}
			Spinning <span class="loading loading-spinner loading-sm"></span>
		{:else}
			Spin
		{/if}
	</button>
</div>

<style>
	.btn {
		--tw-bg-opacity: 0.8;
		border: none;
	}
</style>

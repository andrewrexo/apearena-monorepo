<script lang="ts">
	import { fly } from 'svelte/transition';

	let bet = $state(100);
	let balance = $state(1000);
	let favorites = $state([100, 250, 500, 1000]);
	let recentResults = $state([
		{ amount: 200, win: true },
		{ amount: 100, win: false },
		{ amount: 500, win: true }
	]);
</script>

<div
	class="bg-base-300 flex w-full flex-col gap-2 rounded-lg bg-opacity-30 p-4"
	in:fly={{ y: 10, duration: 500 }}
>
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<button class="btn btn-circle btn-sm" onclick={() => (bet = Math.max(0, bet - 50))}>-</button>
			<div class="flex flex-col">
				<span class="text-xs opacity-70">Bet Amount</span>
				<span class="text-xl font-bold">{bet}</span>
			</div>
			<button class="btn btn-circle btn-sm" onclick={() => (bet = Math.min(balance, bet + 50))}
				>+</button
			>
		</div>

		<div class="flex flex-col items-end">
			<span class="text-xs opacity-70">Balance</span>
			<span class="text-xl font-bold">{balance}</span>
		</div>
	</div>

	<div class="flex gap-2">
		{#each favorites as amount}
			<button
				class="btn btn-sm flex-1"
				class:btn-primary={bet === amount}
				onclick={() => (bet = amount)}
			>
				{amount}
			</button>
		{/each}
	</div>

	<div class="flex gap-2 text-xs">
		{#each recentResults as result}
			<div class={result.win ? 'text-success' : 'text-error'}>
				{result.win ? '+' : '-'}{result.amount}
			</div>
		{/each}
	</div>
</div>

<style>
	.btn {
		--tw-bg-opacity: 0.8;
		border: none;
	}
</style>

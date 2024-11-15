<script lang="ts">
	import { statsState } from '$lib/state/stats.svelte';
	import { fade } from 'svelte/transition';

	let totalWagered = $state(420000);
	let winRate = $state(49.5);
</script>

<div class="mt-12 grid grid-cols-3 gap-8 text-center">
	<div class="rounded-lg bg-black bg-opacity-40 p-4 backdrop-blur-sm">
		<div class="relative h-8">
			{#if statsState.connected}
				<div
					class="absolute inset-0 text-2xl font-bold text-yellow-400"
					transition:fade|local={{ duration: 150 }}
				>
					{statsState.connected}
				</div>
			{/if}
		</div>
		<div class="pt-1 text-sm text-yellow-100">Active Players</div>
	</div>
	<div class="rounded-lg bg-black bg-opacity-40 p-4 backdrop-blur-sm">
		<div class="relative flex h-8 items-center justify-center">
			{#if statsState.connected}
				<div
					class="absolute inset-0 text-2xl font-bold text-yellow-400"
					transition:fade|local={{ duration: 150 }}
				>
					{totalWagered}
				</div>
			{/if}
		</div>
		<div class="pt-1 text-sm text-yellow-100">Bananas Wagered</div>
	</div>
	<div class="rounded-lg bg-black bg-opacity-40 p-4 backdrop-blur-sm">
		<div class="relative h-8">
			{#if statsState.connected}
				<div
					class="absolute inset-0 text-2xl font-bold text-yellow-400"
					transition:fade|local={{ duration: 150 }}
				>
					{winRate}%
				</div>
			{/if}
		</div>
		<div class="pt-1 text-sm text-yellow-100">Win Rate</div>
	</div>
</div>

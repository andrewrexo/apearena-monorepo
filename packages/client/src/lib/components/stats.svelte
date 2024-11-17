<script lang="ts">
	import { formatCurrency, formatPercent } from '$lib/formatters';
	import { statsState } from '$lib/state/stats.svelte';
	import { fade } from 'svelte/transition';
	import Chat from './chat.svelte';
	let totalWagered = $state(420000);
	let winRate = $state(0.495);
	let last7DaysWagered = $state(17259);
</script>

<div
	class="grid grid-cols-1 gap-4 rounded-xl bg-opacity-40 backdrop-blur-sm md:grid-cols-[240px_1fr] md:px-0"
>
	<div
		class="bg-base-300 order-2 flex flex-col-reverse justify-between rounded-lg bg-opacity-30 md:order-1"
	>
		<div class="stat">
			<div class="stat-title">Connected players</div>
			<div class="stat-value">
				{#if statsState.connected}
					<div transition:fade|local={{ duration: 150 }} class="flex items-center gap-2">
						<span class="badge badge-xs bg-success/70 mb-1 rounded-full"></span>
						{statsState.connected}
					</div>
				{/if}
			</div>
			<div class="stat-desc">
				players online as of {new Date().toLocaleTimeString()}
			</div>
		</div>

		<div class="stat">
			<div class="stat-title">Total wagered ($)</div>
			<div class="stat-value">
				{#if statsState.connected}
					<div transition:fade|local={{ duration: 150 }}>
						{formatCurrency(totalWagered)}
					</div>
				{/if}
			</div>
			<div class="stat-desc">
				↗︎ {formatCurrency(last7DaysWagered)} in last 7 days
			</div>
		</div>

		<div class="stat">
			<div class="stat-title">7-day win percentage</div>
			<div class="stat-value min-h-10">
				{#if statsState.connected}
					<div transition:fade|local={{ duration: 150 }}>
						{winRate.toLocaleString('en-US', { style: 'percent', maximumFractionDigits: 1 })}
					</div>
				{/if}
			</div>
			<div class="stat-desc">↘︎ 0.12% since last 7 days</div>
		</div>
	</div>
	<div class="order-1 flex w-full flex-col-reverse p-0 md:order-2 md:flex-col">
		<Chat />
	</div>
</div>

<style lang="postcss">
	.stat {
		@apply p-4 md:py-2;
	}

	.stat-title {
		@apply text-sm;
	}

	.stat-value {
		@apply font-pixel min-h-7 text-xl;
	}

	.stat-desc {
		@apply text-xs;
	}
</style>

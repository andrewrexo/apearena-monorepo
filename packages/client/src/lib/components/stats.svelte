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
	class=" grid grid-cols-1 rounded-xl bg-black bg-opacity-40 p-4 backdrop-blur-sm md:grid-cols-[180px_1fr] md:gap-12 md:px-0"
>
	<div class="order-2 flex flex-col-reverse justify-between md:order-1">
		<div class="stat">
			<div class="stat-title">Connected players</div>
			<div class="stat-value">
				{#if statsState.connected}
					<div transition:fade|local={{ duration: 150 }}>
						{statsState.connected}
					</div>
				{/if}
			</div>
			<div class="stat-desc">players online as of {new Date().toLocaleTimeString()}</div>
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
	<div
		class="order-1 flex max-h-full w-full flex-col-reverse p-1 pr-0 md:order-2 md:flex-col md:pr-4"
	>
		<div class="w-full px-1 py-3 md:py-0">
			<span
				class="divider divider-horizontal md:divider-vertical mx-0 mt-4 block h-[2px] w-full bg-neutral-400 bg-opacity-20 md:mb-4 md:mt-1 md:hidden"
			></span>
		</div>
		<Chat />
	</div>
</div>

<style lang="postcss">
	.stat {
		@apply p-2 md:p-2 md:px-6;
	}

	.stat-title {
		@apply mb-2;
	}

	.stat-value {
		@apply font-pixel min-h-10 text-3xl;
	}

	.stat-desc {
		@apply text-xs;
	}
</style>

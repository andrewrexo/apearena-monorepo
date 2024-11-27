<script lang="ts">
	import { formatCurrency } from '$lib/formatters';
	import { statsState } from '$lib/state/stats.svelte';
	import { fade } from 'svelte/transition';

	let totalWagered = $state(420000);
	let last7DaysWagered = $state(17259);
</script>

{#snippet notConnectedStats()}
	<div
		transition:fade|local={{ duration: 150 }}
		class="bg-base-300/20 absolute mt-[2px] h-6 w-[100px] animate-pulse rounded-sm"
	/>
{/snippet}

<div class="stats-container">
	<div class="stat-grid">
		<div class="stat glass">
			<div class="stat-title">Total wagered ($)</div>
			<div class="stat-value">
				{#if statsState.connected}
					<div transition:fade|local={{ duration: 150 }}>
						{formatCurrency(totalWagered)}
					</div>
				{:else}
					{@render notConnectedStats()}
				{/if}
			</div>
			<div class="stat-desc">↗︎ {formatCurrency(last7DaysWagered)} in last 7 days</div>
		</div>

		<div class="stat glass">
			<div class="stat-title">Active Players</div>
			<div class="stat-value">
				{#if statsState.connected}
					<div transition:fade|local={{ duration: 150 }} class="flex items-center gap-2">
						<span class="pulse-dot" />
						{statsState.connected}
					</div>
				{:else}
					{@render notConnectedStats()}
				{/if}
			</div>
			<div class="stat-desc">players online as of {new Date().toLocaleTimeString()}</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.stats-container {
		@apply mx-auto w-full max-w-xl px-4;
	}

	.stat-grid {
		@apply grid grid-cols-1 gap-4 md:grid-cols-2;
	}

	.stat {
		@apply rounded-xl border border-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:border-white/20;
	}

	.stat-title {
		@apply text-sm text-white/70;
	}

	.stat-value {
		@apply font-pixel my-2 min-h-7 text-2xl md:text-3xl;
	}

	.stat-desc {
		@apply text-xs text-white/50;
	}

	.pulse-dot {
		@apply bg-success h-2 w-2 rounded-full;
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
</style>

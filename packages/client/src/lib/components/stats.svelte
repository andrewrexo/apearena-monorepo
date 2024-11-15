<script lang="ts">
	let activePlayers = $state(1337);
	let totalWagered = $state(420000);
	let winRate = $state(49.5);
</script>

<div class="mt-12 grid grid-cols-3 gap-8 text-center">
	<div class="rounded-lg bg-black bg-opacity-40 p-4 backdrop-blur-sm">
		<div class="text-2xl font-bold text-yellow-400">{activePlayers}</div>
		<div class="text-sm text-yellow-100">Active Players</div>
	</div>
	<div class="rounded-lg bg-black bg-opacity-40 p-4 backdrop-blur-sm">
		<div class="text-2xl font-bold text-yellow-400">{totalWagered}</div>
		<div class="text-sm text-yellow-100">Bananas Wagered</div>
	</div>
	<div class="rounded-lg bg-black bg-opacity-40 p-4 backdrop-blur-sm">
		<div class="text-2xl font-bold text-yellow-400">{winRate}%</div>
		<div class="text-sm text-yellow-100">Win Rate</div>
	</div>
</div>

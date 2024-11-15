<script lang="ts">
	import Actions from '$lib/components/actions.svelte';
	import Particles from '$lib/components/particles.svelte';
	import Stats from '$lib/components/stats.svelte';
</script>

<main
	class="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-black"
>
	<Particles />
	<div class="relative z-10 flex min-h-screen flex-col items-center justify-center p-6">
		<Actions />
		<Stats />
	</div>
</main>

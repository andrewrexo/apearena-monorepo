<script lang="ts">
	import Particles from '$lib/components/particles.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<div>
	<Particles />
	{@render children()}
</div>

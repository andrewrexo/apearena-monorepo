<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="font-pixel">
	{@render children()}
</div>

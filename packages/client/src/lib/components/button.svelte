<script lang="ts">
	let { children } = $props();
</script>

<div
	class="rounded-lg border-b-4 border-b-gray-400 bg-gray-300 px-6 py-3 text-black transition-all duration-100 ease-in-out hover:border-b-0"
>
	{@render children()}
</div>

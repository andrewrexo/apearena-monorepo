<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<section class="flex max-h-[240px] w-full flex-col items-center justify-center">
	<div class="logo-container" class:mounted>
		<img src="/images/logo.webp" alt="ape arena" class="logo" in:fly={{ y: 10, duration: 600 }} />
	</div>
</section>

<style lang="postcss">
	.logo-container {
		@apply transition-all delay-300 duration-700 ease-out;
		transform: translateY(0);
	}

	.logo-container.mounted {
		transform: translateY(-20px);
	}

	.logo {
		@apply max-h-[200px] w-auto object-contain;
	}
</style>

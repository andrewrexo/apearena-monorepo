<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<section class="flex w-full flex-col items-center justify-center">
	<div class="logo-container" class:mounted>
		<enhanced:img
			src="/static/images/logo.webp"
			alt="ape arena"
			class="logo"
			fetchpriority="high"
			loading="eager"
			in:fly={{ y: 0, duration: 600 }}
		/>
	</div>
</section>

<style lang="postcss">
	.logo-container {
		@apply transition-all delay-500 duration-700 ease-out md:-mt-0;
		transform: translateY(0);
	}

	.logo-container.mounted {
		transform: translateY(-20px);
	}

	.logo {
		@apply max-h-[220px] w-auto px-3 md:px-0;
	}
</style>

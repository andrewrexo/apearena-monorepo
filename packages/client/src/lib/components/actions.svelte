<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import Chat from './chat.svelte';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<section class="flex w-full flex-col justify-center gap-6 md:flex-row">
	<div class="logo-container -mb-4 md:min-w-[400px]" class:mounted>
		<!-- <enhanced:img
			src="/static/images/logo.webp"
			alt="ape arena"
			class="logo"
			fetchpriority="high"
			loading="eager"
			in:fly={{ y: 0, duration: 600 }}
		/> -->
		<h1
			class="animated-title font-pixel ml-2 bg-clip-text text-3xl font-semibold text-transparent"
			in:fly={{ y: 0, duration: 600 }}
		>
			ape arena
		</h1>
	</div>
	<Chat />
</section>

<style lang="postcss">
	.logo-container {
		@apply transition-all duration-700 ease-out md:-mt-0;
		z-index: 100000000;
		transform: translateY(-10px);
	}

	.logo-container.mounted {
		transform: translateY(0px);
	}

	.logo {
		@apply max-h-[220px] w-auto md:px-0;
	}
</style>

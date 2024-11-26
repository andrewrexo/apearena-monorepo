<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Socials from './socials.svelte';

	let mounted = $state(false);
	let isMobile = $state(false);
	let isScrolled = $state(false);

	const handleScroll = (event: UIEvent) => {
		isMobile = window.innerWidth < 768;
		isScrolled = (event.currentTarget as Window).scrollY > 0;
	};

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:window on:scroll={handleScroll} />

<section class="flex w-full flex-col justify-center gap-6 md:flex-row">
	<div
		class="logo-container font-superPixel flex w-full flex-col items-center text-center text-sm font-medium text-neutral-200 md:items-start md:text-left"
		class:mounted
	>
		<div class="min-h-[60px] md:mt-0">
			<h1
				class="animated-title font-superPixel bg-clip-text text-5xl font-semibold text-transparent"
				in:fly={{ y: 0, duration: 600 }}
				out:fade={{ duration: 100 }}
			>
				ape arena
			</h1>
		</div>
		<span class="gap-2">
			> on-chain gaming & gambling
			<span class="flex items-center justify-center gap-2 md:justify-start">
				> automated token buybacks & burns
			</span>
		</span>
		<div class="flex flex-col gap-6 pt-4">
			<span class="font-superPixel text-sm tracking-wide text-neutral-200">
				join our <span class="text-primary">community</span> today
			</span>
			<Socials />
		</div>
	</div>
	<section class="hidden w-full md:flex"></section>
</section>

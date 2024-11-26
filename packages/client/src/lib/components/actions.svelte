<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import Socials from './socials.svelte';
	import Chat from './chat.svelte';

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

<section class="flex w-full gap-6 md:flex-row">
	<div
		class="logo-container flex w-full flex-col items-center text-center text-sm font-medium md:w-[580px] md:items-start md:text-left"
		class:mounted
	>
		<div class="min-h-[60px] md:mt-0">
			<h1
				class="animated-title bg-clip-text font-mono text-5xl font-extrabold text-transparent transition-none"
				in:fly={{ y: 20, duration: 300 }}
			>
				ape arena
			</h1>
		</div>
		<span class="gap-2 font-mono">
			> on-chain gaming & gambling
			<span class="flex items-center justify-center gap-2 md:justify-start">
				> automated token buybacks & burns
			</span>
		</span>
		<div class="flex flex-col gap-6 pt-4">
			<span class="text-sm tracking-wide">
				join our <span class="text-primary">community</span> today
			</span>
			<Socials />
		</div>
	</div>
	<section class="hidden w-full flex-col gap-2 md:mt-2 md:flex">
		<h1 class=" font-mono text-lg tracking-tight">[ live chat ]</h1>

		<Chat />
	</section>
</section>

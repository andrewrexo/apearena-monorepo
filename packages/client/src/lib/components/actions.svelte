<script lang="ts">
	import { onMount } from 'svelte';
	import Socials from './socials.svelte';
	import { fly } from 'svelte/transition';

	let mounted = $state(false);
	let hoveredButton = $state(false);
	let shouldBounce = $state(true);

	onMount(() => {
		mounted = true;
		setTimeout(() => {
			shouldBounce = false;
		}, 1500);
	});
</script>

<section
	class="flex min-h-[260px] flex-col items-center justify-end py-4"
	style:view-transition-name="page-content"
>
	<span
		class:bounce-twice={shouldBounce}
		class="animated-title font-pixel flex transform cursor-default select-none flex-col bg-clip-text text-center text-6xl font-extrabold text-transparent transition-transform hover:scale-105 md:pb-2"
	>
		ape arena
		<span class="font-sans text-sm">slots, battles, and $BANANA</span>
	</span>
	<div
		class="md:btn-wide z-10 flex w-full items-center justify-center gap-8 rounded-2xl bg-opacity-30 p-2 py-8 pb-6 md:mb-8 md:mt-2 md:gap-14 md:bg-transparent md:py-2"
	>
		<div class="font-pixel flex w-full items-center justify-between gap-2">
			<span class="text-sm" in:fly={{ y: 10, duration: 500 }}>
				join the <span class="animated-title flex bg-clip-text text-transparent">🍌 $BANANA</span>
				gang
			</span>
			{#if mounted}
				<div in:fly={{ y: 20 }}>
					<Socials />
				</div>
			{/if}
		</div>
	</div>
</section>

<style lang="postcss">
	.bounce-twice {
		animation:
			shine 4s linear infinite,
			bounceTwo 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
	}
</style>

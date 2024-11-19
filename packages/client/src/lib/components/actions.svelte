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

<section class="flex flex-col items-center pt-10 md:pt-4">
	<span
		class:bounce-twice={shouldBounce}
		class="animated-title font-pixel flex transform cursor-default select-none flex-col bg-clip-text text-center text-6xl font-extrabold text-transparent transition-transform hover:scale-105 md:pb-2"
	>
		ape arena
		<span class="font-sans text-sm">slots, battles, and $BANANA</span>
	</span>
	<div
		class="md:btn-wide z-10 flex w-full flex-col-reverse items-center justify-center rounded-2xl bg-opacity-30 p-2 py-8 pb-6 md:mb-8 md:mt-4 md:bg-transparent md:py-2"
	>
		<div class="font-pixel flex min-h-24 w-full items-center justify-between gap-2 pt-8">
			{#if mounted}
				<span class="text-sm" in:fly={{ y: 10, duration: 500 }}>
					join the <span class="animated-title flex bg-clip-text text-transparent">🍌 $BANANA</span>
					gang
				</span>

				<div in:fly={{ y: 10 }}>
					<Socials />
				</div>
			{/if}
		</div>
		<a href="/slot" class="w-full">
			<button
				onpointerenter={() => (hoveredButton = true)}
				onpointerleave={() => (hoveredButton = false)}
				class="btn-block from-primary to-secondary group relative flex transform cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r py-4 font-bold
         text-neutral-100 shadow-md transition-all
         duration-300 hover:scale-105 hover:text-white hover:shadow-2xl"
			>
				{#if hoveredButton}
					<span class="text-center text-2xl">🍌🍌🍌🍌🍌</span>
					<div class="absolute inset-0 animate-pulse rounded-xl bg-white opacity-20"></div>
				{:else}
					ENTER THE ARENA
					<span class="-mr-5 h-8 w-8 text-2xl"> 🍌 </span>
				{/if}
			</button>
		</a>
	</div>
</section>

<style lang="postcss">
	.bounce-twice {
		animation:
			shine 4s linear infinite,
			bounceTwo 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
	}

	@keyframes bounceTwo {
		0%,
		100% {
			transform: translateY(0);
			animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
		}
		25% {
			transform: translateY(-20px);
			animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
		}
		45% {
			transform: translateY(0);
			animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
		}
		70% {
			transform: translateY(-12px);
			animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
		}
		85% {
			transform: translateY(0);
		}
	}
</style>

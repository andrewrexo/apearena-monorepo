<script lang="ts">
	import { onMount } from 'svelte';
	import Socials from './socials.svelte';
	import { fade, fly } from 'svelte/transition';

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

<section class="flex flex-col items-center pt-8">
	<span
		class:bounce-twice={shouldBounce}
		class="animated-title font-pixel flex transform cursor-default select-none flex-col bg-clip-text text-center text-6xl font-extrabold uppercase text-transparent transition-transform hover:scale-105 md:pb-2"
	>
		ape arena
		<span class="font-sans text-sm capitalize">SLOTS, BATTLES and $BANANA</span>
	</span>
	<div
		class="md:btn-wide flex w-full flex-col-reverse items-center justify-center rounded-2xl bg-opacity-30 p-2 py-8 pb-6 md:mb-8 md:mt-4 md:bg-transparent md:py-2"
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
		<button
			onmouseenter={() => (hoveredButton = true)}
			onmouseleave={() => (hoveredButton = false)}
			class="btn-lg btn-block from-primary to-secondary group relative flex transform cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r font-bold
         text-white transition-all duration-300
         hover:scale-105 hover:text-white hover:shadow-2xl"
		>
			{#if hoveredButton}
				<span class="text-center text-2xl">🍌🍌🍌🍌🍌</span>
				<div class="absolute inset-0 animate-pulse rounded-xl bg-white opacity-20"></div>
			{:else}
				ENTER THE ARENA
			{/if}
		</button>
	</div>
</section>

<style lang="postcss">
	.animated-title {
		background-image: linear-gradient(
			-60deg,
			theme(colors.primary) 0%,
			theme(colors.primary) 20%,
			theme(colors.secondary) 40%,
			theme(colors.secondary) 60%,
			theme(colors.primary) 80%,
			theme(colors.primary) 100%
		);
		background-size: 300% auto;
		animation: shine 4s linear infinite;
	}

	.bounce-twice {
		animation:
			shine 4s linear infinite,
			bounceTwo 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
	}

	@keyframes shine {
		to {
			background-position: 300% center;
		}
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

<script lang="ts">
	import { onMount } from 'svelte';

	let hoveredButton = $state(false);
	let shouldBounce = $state(true);

	onMount(() => {
		setTimeout(() => {
			shouldBounce = false;
		}, 1500);
	});
</script>

<section class="flex flex-1 flex-col items-center justify-center py-12">
	<span class="mb-8 flex flex-col items-center gap-4 md:flex-row">
		<h1
			class="animated-title font-pixel transform cursor-default select-none bg-clip-text text-center text-6xl font-extrabold uppercase text-transparent transition-transform hover:scale-105"
			class:bounce-twice={shouldBounce}
		>
			ape arena
		</h1>
	</span>

	<a href="/play">
		<button
			onmouseenter={() => (hoveredButton = true)}
			onmouseleave={() => (hoveredButton = false)}
			class="btn-lg btn-wide from-primary to-secondary group relative flex transform cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r font-bold
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
	</a>
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

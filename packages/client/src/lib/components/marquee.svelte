<script lang="ts">
	type NewsItem = {
		type: 'win' | 'news';
		message: string;
	};

	const defaultNews: NewsItem[] = [
		{ type: 'win', message: '0x00.. won 1000 coins!' },
		{ type: 'news', message: 'New player joined the game!' },
		{ type: 'news', message: 'Next jackpot: 5000 coins' },
		{ type: 'win', message: '0xAB.. won 2500 coins!' },
		{ type: 'news', message: 'Daily challenge reset in 1 hour' },
		{ type: 'win', message: '0xCD.. won 750 coins!' }
	];

	let news = $state<NewsItem[]>(defaultNews);

	function addWin(player: string, amount: number) {
		news = [
			...news,
			{
				type: 'win' as const,
				message: `${player} won ${amount} coins!`
			}
		].slice(-10);
	}

	function addNews(message: string) {
		news = [
			...news,
			{
				type: 'news' as const,
				message
			}
		].slice(-10);
	}
</script>

<div
	class="bg-base-300 relative flex h-6 overflow-hidden rounded-xl border-none bg-opacity-50 px-2 py-1"
>
	<div class="flex">
		<div class="marquee-content" aria-hidden="true">
			{#each [...news, ...news] as item}
				<span
					class="mx-2 whitespace-nowrap text-xs font-bold"
					class:text-primary={item.type === 'win'}
					class:text-secondary={item.type === 'news'}
				>
					{item.message}
				</span>
			{/each}
		</div>
	</div>
</div>

<style>
	.marquee-content {
		display: flex;
		transform: translateZ(0);
		animation: scroll 30s linear infinite;
		will-change: transform;
		backface-visibility: hidden;
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	/* Pause animation when user prefers reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.marquee-content {
			animation-play-state: paused;
		}
	}
</style>

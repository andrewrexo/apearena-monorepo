<script lang="ts">
	type NewsItem = {
		type: 'win' | 'news';
		message: string;
	};

	let news = $state<NewsItem[]>([
		{ type: 'win', message: '0x00.. won 1000 coins!' },
		{ type: 'news', message: 'Welcome to the game, 0x00!' },
		{ type: 'win', message: '0x00.. won 500 coins!' },
		{ type: 'win', message: '0x00.. won 500 coins!' },
		{ type: 'win', message: '0x00.. won 500 coins!' },
		{ type: 'win', message: '0x00.. won 500 coins!' }
	]);

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

<div class="btn btn-sm bg-base-300 min-h-5 border-none bg-opacity-50 px-2 py-2">
	<div class="relative h-8 overflow-hidden rounded-xl">
		<div class="marquee-container">
			<div class="marquee-content">
				{#each news as item}
					<span
						class="mx-4 text-xs font-bold"
						class:text-primary={item.type === 'win'}
						class:text-secondary={item.type === 'news'}
					>
						{item.message}
					</span>
				{/each}
			</div>
			<div class="marquee-content" aria-hidden="true">
				{#each news as item}
					<span
						class="mx-4 text-xs font-bold"
						class:text-success={item.type === 'win'}
						class:text-primary={item.type === 'news'}
					>
						{item.message}
					</span>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.marquee-container {
		display: flex;
		width: fit-content;
		transform: translate3d(0, 0, 0);
		animation: scroll 20s linear infinite;
		will-change: transform;
	}

	.marquee-content {
		display: flex;
		white-space: nowrap;
		flex-shrink: 0;
	}

	@keyframes scroll {
		from {
			transform: translate3d(0, 0, 0);
		}
		to {
			transform: translate3d(-50%, 0, 0);
		}
	}
</style>

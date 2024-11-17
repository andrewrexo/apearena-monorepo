<script>
	import Icon from '@iconify/svelte';
</script>

<div class="z-10 flex gap-4">
	<a href="https://x.com/apearena" target="_blank">
		<Icon icon="skill-icons:twitter" />
	</a>
	<a href="https://t.me/apearena" target="_blank">
		<Icon icon="logos:telegram" />
	</a>
	<a href="https://discord.gg/apearena" target="_blank">
		<Icon icon="skill-icons:discord" />
	</a>
</div>

<style lang="postcss">
	a {
		font-size: 2rem;
		width: 2rem;
		height: 2rem;
		@apply transition-all hover:scale-105 hover:shadow-lg;
	}
</style>

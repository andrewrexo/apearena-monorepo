<script>
	import LogosTelegram from '~icons/logos/telegram';
	import SkillIconsDiscord from '~icons/skill-icons/discord';
	import SkillIconsTwitter from '~icons/skill-icons/twitter';
</script>

<div class="z-10 flex gap-4">
	<a href="https://x.com/apearena" target="_blank" class="h-8 w-8">
		<SkillIconsTwitter />
	</a>
	<a href="https://t.me/apearena" target="_blank" class="h-8 w-8">
		<LogosTelegram />
	</a>
	<a href="https://discord.gg/apearena" target="_blank" class="h-8 w-8">
		<SkillIconsDiscord />
	</a>
</div>

<style lang="postcss">
	a {
		font-size: 2rem;
		width: 2rem;
		height: 2rem;
		@apply transition-all duration-300 hover:scale-110 hover:shadow-lg;
	}
</style>

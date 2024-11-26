<script>
	import LogosTelegram from '~icons/logos/telegram';
	import SkillIconsDiscord from '~icons/skill-icons/discord';
	import SkillIconsTwitter from '~icons/skill-icons/twitter';
	import SimpleIconsCoinmarketcap from '~icons/simple-icons/coinmarketcap';
</script>

<div class="z-5 flex w-full justify-center gap-4 sm:justify-start">
	<a href="https://x.com/apearena" target="_blank">
		<SkillIconsTwitter width="2.5rem" height="2.5rem" />
	</a>
	<a href="https://t.me/apearena" target="_blank">
		<LogosTelegram width="2.5rem" height="2.5rem" />
	</a>
	<a href="https://discord.gg/apearena" target="_blank">
		<SkillIconsDiscord width="2.5rem" height="2.5rem" />
	</a>
	<a
		href="https://coinmarketcap.com/currencies/ape-arena/"
		target="_blank"
		class="text-primary -ml-0.5 h-10 w-10"
	>
		<SimpleIconsCoinmarketcap width="2.5rem" height="2.5rem" />
	</a>
</div>

<style lang="postcss">
	a {
		@apply transition-all duration-300 hover:scale-110 hover:shadow-lg;
	}
</style>

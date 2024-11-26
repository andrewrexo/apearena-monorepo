<script lang="ts">
	import { themeIconRecord, displayThemeNames } from '$lib/theme';
	import MdiPaletteOutline from '~icons/mdi/palette-outline';
	import Icon from '@iconify/svelte';
	import { fade, fly } from 'svelte/transition';
	import theme from '$lib/state/theme.svelte';

	let { isDim = false }: { isDim: boolean } = $props();

	let isOpen = $state(false);
	let mounted = $state(false);

	function clickOutside(node: HTMLElement) {
		const handleClick = (event: MouseEvent) => {
			if (!node.contains(event.target as Node)) {
				isOpen = false;
			}
		};

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}

	function toggleDropdown(event: MouseEvent) {
		event.stopPropagation();
		isOpen = !isOpen;
	}

	function handleThemeChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const newTheme = target.value;

		document.body.setAttribute('data-theme', newTheme);
		localStorage.setItem('theme', newTheme);
		theme.currentTheme = newTheme;
		theme.updateThemeColors();
	}
</script>

<div class="dropdown dropdown-end z-[100000000]" use:clickOutside>
	<button
		class="btn btn-sm bg-opacity-40 mr-1 flex items-center gap-2 border-none"
		class:bg-opacity-40={isDim}
		onclick={toggleDropdown}
		in:fade={{ duration: 300 }}
	>
		<MdiPaletteOutline class="h-3 w-3" />
	</button>
	<ul
		class="dropdown-content bg-base-300 rounded-box mt-4 w-52 space-y-2 p-2 shadow-2xl"
		class:hidden={!isOpen}
	>
		{#each Object.keys(themeIconRecord) as themeOption}
			<li>
				<div class="flex items-center justify-between gap-2">
					<input
						type="radio"
						name="theme-dropdown"
						class="theme-controller btn btn-sm btn-ghost flex-1 justify-start lowercase"
						aria-label={displayThemeNames[themeOption]}
						value={themeOption}
						checked={theme.currentTheme === themeOption}
						onchange={handleThemeChange}
					/>
					<Icon
						icon={themeIconRecord[themeOption]}
						class="absolute right-0 mr-4 {theme.currentTheme === themeOption &&
							'text-primary-content'}"
						width="1.25rem"
					/>
				</div>
			</li>
		{/each}
	</ul>
</div>

<script lang="ts">
	import { themeIconRecord, displayThemeNames } from '$lib/theme';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let themeList = $state(['night', 'dark', 'dracula', 'sunset', 'dim']);
	let currentTheme = $state('dracula');

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
		currentTheme = newTheme;
	}

	onMount(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme && themeList.includes(savedTheme)) {
			currentTheme = savedTheme;
		}
		mounted = true;
	});
</script>

<div class="dropdown dropdown-end z-[100000000] min-h-10 self-end pt-2" use:clickOutside>
	{#if mounted}
		<button
			class="btn btn-sm mr-1 flex items-center gap-2 border-none bg-opacity-50"
			onclick={toggleDropdown}
			in:fade={{ duration: 300 }}
		>
			theme
			<span class="min-h-3 min-w-3" transition:fly={{ y: -10 }}>
				<Icon icon="material-symbols:palette" />
			</span>
		</button>
	{/if}
	<ul
		class="dropdown-content bg-base-300 rounded-box mt-4 w-52 space-y-2 p-2 shadow-2xl"
		class:hidden={!isOpen}
	>
		{#each Object.keys(themeIconRecord) as theme}
			<li>
				<div class="flex items-center justify-between gap-2">
					<input
						type="radio"
						name="theme-dropdown"
						class="theme-controller btn btn-sm btn-ghost flex-1 justify-start lowercase"
						aria-label={displayThemeNames[theme]}
						value={theme}
						checked={currentTheme === theme}
						onchange={handleThemeChange}
					/>
					<Icon
						icon={themeIconRecord[theme]}
						class="absolute right-0 mr-4 {currentTheme === theme && 'text-primary-content'}"
						width="1.25rem"
					/>
				</div>
			</li>
		{/each}
	</ul>
</div>

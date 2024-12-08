<script lang="ts">
	import { fly } from 'svelte/transition';
	import { toast } from '$lib/state/toast.svelte';
	import WinnerIcon from '~icons/bx/bxs-party';
	import LoserIcon from '~icons/solar/gamepad-bold';
</script>

<div
	class="bg-primary text-primary-content absolute top-2 right-4 z-50 flex items-center gap-2 rounded-lg p-2"
	class:bg-primary={!toast.isError}
	class:bg-error={toast.isError}
	transition:fly={{ x: 100, duration: 300 }}
>
	{#if toast.isError}
		<LoserIcon class="h-6 w-6" />
	{:else}
		<WinnerIcon class="h-6 w-6" />
	{/if}
	<span>{toast.toastMessage}</span>
</div>

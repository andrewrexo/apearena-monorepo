<script lang="ts">
	import { onMount } from 'svelte';
	import Socials from './socials.svelte';
	import { fade, fly, scale } from 'svelte/transition';

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

<section
	class="mb-2 flex flex-col items-center justify-end"
	style:view-transition-name="page-content"
	in:scale={{ start: 1.25 }}
>
	<figure class="transition-all duration-200 md:-mt-6">
		<img src="/images/logo.webp" alt="ape arena" class="max-h-[250px] w-auto object-cover" />
	</figure>
</section>

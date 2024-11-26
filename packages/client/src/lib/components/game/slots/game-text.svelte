<script>
	import { HTML } from '@threlte/extras';
	import theme from '$lib/state/theme.svelte';
	import { spring } from 'svelte/motion';
	import { useTask } from '@threlte/core';

	let { text } = $props();
</script>

<HTML
	transform
	occlude={false}
	style="
			font-size: 32px;
			font-weight: 800;
			padding: 60px;
			margin-bottom: -10px;
			color: #fff;
			text-align: center;
			text-shadow: 
				0 0 5px {theme.colors.primaryOpaque},
				0 0 20px {theme.colors.primaryOpaque},
				0 0 10px {theme.colors.primaryOpaque},
				0 0 10px {theme.colors.primaryOpaque};
			font-family: 'PixelFont', system-ui, sans-serif;
			white-space: nowrap;
			pointer-events: none;
			transform-origin: center center;
			will-change: transform;
			letter-spacing: 0.1em;
			-webkit-background-clip: text;
      "
>
	{text}
</HTML>

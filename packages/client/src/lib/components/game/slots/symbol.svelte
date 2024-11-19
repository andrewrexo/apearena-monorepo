<script>
	import { HTML } from '@threlte/extras';
	import theme from '$lib/state/theme.svelte';

	let { symbol } = $props();
</script>

<HTML
	transform
	occlude={false}
	castShadow
	receiveShadow
	center
	style="
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 38px;
		border-radius: 6px;
		font-weight: 700;
		background: linear-gradient(
      135deg,
      {theme.colors.primaryOpaque} 0%,
      {theme.colors.primary} 100%
    );
    overflow: hidden;
    position: relative;
  "
>
	<div
		style="
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.4),
      transparent
    );
    transform: translateX(-100%);
    animation: shimmer 2s infinite;
  "
	></div>
	<span
		style="
									position: relative;
									z-index: 1;
									font-weight: bold;
									animation: bounce 0.5s ease-out;
								"
	>
		{symbol}
	</span>
</HTML>

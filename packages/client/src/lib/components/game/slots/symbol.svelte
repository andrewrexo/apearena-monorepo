<script>
	import { HTML } from '@threlte/extras';
	import theme from '$lib/state/theme.svelte';

	let { symbol } = $props();

	// Pre-compute styles to reduce runtime calculations
	const style = `
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 38px;
		border-radius: 6px;
		font-weight: 700;
		overflow: hidden;
		position: relative;
		background: linear-gradient(135deg, oklch(var(--s)) 0%, oklch(var(--p)) 100%);
	`;

	const spanStyle = `
		position: relative;
		z-index: 1;
		font-weight: bold;
	`;
</script>

<HTML transform occlude={false} castShadow={false} receiveShadow={false} center {style} class="">
	<span style={spanStyle}>{symbol}</span>
</HTML>

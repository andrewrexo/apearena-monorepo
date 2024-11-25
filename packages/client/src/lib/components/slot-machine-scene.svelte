<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { HTML } from '@threlte/extras';
	import { spring } from 'svelte/motion';
	import { onDestroy, onMount } from 'svelte';
	import { untrack } from 'svelte';

	import theme from '$lib/state/theme.svelte';
	import Reel from './game/slots/reel.svelte';
	import GameText from './game/slots/game-text.svelte';

	// Props with defaults
	let { reels = [], spinning = false, showParticles = true, sceneActions = $bindable() } = $props();

	let particles = $state([]);
	// Constants moved outside component for better performance
	const INITIAL_PARTICLE_COUNT = 40;
	const REEL_RADIUS = 0.925;
	const SYMBOL_COUNT = 5;
	const POSITION_EPSILON = 0.25;
	const PARTICLE_DECAY = 0.99;
	const SYMBOL_OPACITY_DECAY = 0.98;
	const TEXT_OPACITY_DECAY = 0.97;

	let isMobile = $state(false);
	let flyingSymbols = $state([]);
	let multiplierTexts = $state([]);
	let cameraShakeActive = $state(false);

	let CAMERA_Z = $derived(isMobile ? 5 : 7);

	onMount(() => {
		const mediaQuery = window.matchMedia('(max-width: 768px)');
		isMobile = mediaQuery.matches;

		mediaQuery.addEventListener('change', (e) => {
			isMobile = e.matches;
		});
	});

	// Memoized initial particle setup
	const createInitialParticles = () =>
		Array(INITIAL_PARTICLE_COUNT)
			.fill(null)
			.map(() => ({
				x: Math.random() * 10 - 5,
				y: Math.random() * 10 - 5,
				z: Math.random() * 5,
				scale: Math.random() * 0.5 + 0.5,
				speed: Math.random() * 2 + 1,
				color: untrack(() => theme.colors.primary),
				rotationSpeed: Math.random() * 2 - 1,
				rotation: Math.random() * Math.PI * 2
			}));

	// Springs with optimized settings
	const rotationSpring = spring(
		{ x: 0, y: 0, z: 0 },
		{
			stiffness: 0.05,
			damping: 0.5,
			precision: 0.001
		}
	);

	const jackpotScale = spring(1, {
		stiffness: 0.05,
		damping: 0.2,
		precision: 0.001
	});

	const cameraPosition = spring(
		{ x: 0, y: 0, z: CAMERA_Z },
		{
			stiffness: 0.3,
			damping: 0.5,
			precision: 0.001
		}
	);

	let cameraShake = $state({
		intensity: 0,
		decay: 0.9,
		offset: { x: 0, y: 0, z: 0 }
	});

	// Optimized update task
	useTask((delta: number) => {
		if (spinning) {
			reels = reels.map((reel) =>
				reel.speed === 0
					? reel
					: {
							...reel,
							position: reel.position + reel.speed * delta
						}
			);
		}

		// Camera shake update - only run if active
		if (cameraShakeActive && cameraShake.intensity > 0.01) {
			const intensity = cameraShake.intensity;
			const randomX = (Math.random() - 0.5) * intensity;
			const randomY = (Math.random() - 0.5) * intensity;

			cameraShake.offset = { x: randomX, y: randomY, z: 0 };
			cameraShake.intensity *= cameraShake.decay;

			cameraPosition.set({
				x: randomX,
				y: randomY,
				z: CAMERA_Z + cameraShake.offset.z
			});

			if (cameraShake.intensity <= 0.01) {
				cameraShakeActive = false;
			}
		}

		const currentTime = performance.now() * 0.001;

		rotationSpring.set({
			x: 0.2 + Math.sin(currentTime) * 0.03,
			y: Math.cos(currentTime * 2) * 0.05,
			z: Math.sin(currentTime) * 0.02
		});

		jackpotScale.set(1 + Math.sin(currentTime) * 0.1);

		// Optimized particle updates with fewer allocations
		if (showParticles && particles.length > 0) {
			particles = particles.filter((p) => {
				p.y += p.speed * delta;
				p.scale *= PARTICLE_DECAY;
				return p.scale > 0.01;
			});
		}

		// Optimized flying symbols update
		if (flyingSymbols.length > 0) {
			flyingSymbols = flyingSymbols.filter((symbol) => {
				symbol.y += symbol.speed * delta;
				symbol.rotation += symbol.rotationSpeed * delta;
				symbol.opacity *= SYMBOL_OPACITY_DECAY;
				symbol.scale *= 0.99;
				return symbol.opacity > 0.01;
			});
		}

		// Optimized multiplier texts update
		if (multiplierTexts.length > 0) {
			multiplierTexts = multiplierTexts.filter((text) => {
				text.y += text.speed * delta;
				text.opacity *= TEXT_OPACITY_DECAY;
				text.scale *= 1.02;
				return text.opacity > 0.01;
			});
		}
	});

	// Optimized initialization
	onMount(() => {
		showParticles = false;

		// Auto-cleanup particles
		const timer = setTimeout(() => {
			showParticles = false;
		}, 3200);

		return () => {
			clearTimeout(timer);
		};
	});

	onDestroy(() => {
		rotationSpring.set({ x: 0, y: 0, z: 0 });
	});

	function spawnWinParticles(multiplier: number) {
		const particleCount = Math.min(50, multiplier * 10);
		particles = Array(particleCount)
			.fill(null)
			.map(() => ({
				x: (Math.random() - 0.5) * 3,
				y: -2 + Math.random() * 2,
				z: Math.random() * 2,
				scale: Math.random() * 0.3 + 0.2,
				speed: 3 + Math.random() * 2,
				color: multiplier > 5 ? theme.colors.secondary : theme.colors.primary,
				rotationSpeed: Math.random() * 4 - 2,
				rotation: Math.random() * Math.PI * 2
			}));
	}

	let multiplierTrail = $state({
		active: false,
		points: [] as { x: number; y: number; z: number; opacity: number }[]
	});
	// Add these types and helper functions after other similar declarations
	type FlyingSymbol = {
		symbol: string;
		x: number;
		y: number;
		z: number;
		rotation: number;
		scale: number;
		speed: number;
		rotationSpeed: number;
		opacity: number;
	};

	type MultiplierText = {
		value: string;
		x: number;
		y: number;
		z: number;
		scale: number;
		speed: number;
		opacity: number;
	};

	function spawnFlyingSymbols(symbols: string[], multiplier: number) {
		const newSymbols = symbols.map((symbol) => ({
			symbol,
			x: (Math.random() - 0.5) * 4,
			y: -1,
			z: Math.random() * 2,
			rotation: Math.random() * Math.PI * 2,
			scale: 0.5,
			speed: 3 + Math.random() * 2,
			rotationSpeed: (Math.random() - 0.5) * 4,
			opacity: 1
		}));

		flyingSymbols = [...flyingSymbols, ...newSymbols];

		// Spawn multiplier text
		multiplierTexts = [
			...multiplierTexts,
			{
				value: `${multiplier}x`,
				x: (Math.random() - 0.5) * 2,
				y: -1,
				z: 1,
				scale: 1,
				speed: 4 + Math.random() * 2,
				opacity: 1
			}
		];
	}

	const shakeCamera = (intensity: number) => {
		cameraShake.intensity = intensity;
		cameraShakeActive = true;
	};

	const spawnMultiplierTrail = (multiplier: number) => {
		multiplierTrail.active = true;
		multiplierTrail.points = Array(10)
			.fill(null)
			.map(() => ({ x: 0, y: 0, z: 0, opacity: 1 }));
	};

	// Bind the functions to the sceneActions prop
	$effect(() => {
		if (sceneActions) {
			sceneActions.shakeCamera = shakeCamera;
			sceneActions.spawnWinParticles = spawnWinParticles;
			sceneActions.spawnMultiplierTrail = spawnMultiplierTrail;
			sceneActions.spawnFlyingSymbols = spawnFlyingSymbols;
		}
	});
</script>

<T.PerspectiveCamera
	makeDefault
	position={[$cameraPosition.x, $cameraPosition.y, $cameraPosition.z]}
	fov={50}
	near={0.1}
	far={1000}
/>

<T.Group position.y={isMobile ? -1 : -2}>
	<T.Group
		position.y={2.4}
		position.z={isMobile ? 0.5 : 0.7}
		scale={$jackpotScale}
		rotation.x={$rotationSpring.x}
		rotation.y={$rotationSpring.y}
		rotation.z={$rotationSpring.z}
	>
		<GameText text="JACKPOT" />
	</T.Group>
	<!-- Update lighting -->
	<T.Group
		rotation.x={$rotationSpring.x}
		rotation.y={$rotationSpring.y}
		rotation.z={$rotationSpring.z}
	>
		<Reel {reels} radius={REEL_RADIUS} symbolCount={SYMBOL_COUNT} epsilon={POSITION_EPSILON} />
	</T.Group>
</T.Group>

<!-- Particles -->
{#if showParticles}
	{#each particles as particle}
		<T.Mesh
			position.x={particle.x}
			position.y={particle.y}
			position.z={particle.z}
			scale={particle.scale}
			rotation.z={particle.rotation}
		>
			<T.PlaneGeometry args={[0.5, 0.5]} />
			<T.MeshStandardMaterial
				color={particle.color}
				emissive={particle.color}
				emissiveIntensity={2}
				transparent={true}
				opacity={0.8}
			/>
		</T.Mesh>
	{/each}
{/if}

<!-- Add trail rendering -->
{#if multiplierTrail.active}
	{#each multiplierTrail.points as point}
		<T.Sprite position={[point.x, point.y, point.z]} scale={0.5}>
			<T.SpriteMaterial color={theme.colors.secondary} opacity={point.opacity} transparent={true} />
		</T.Sprite>
	{/each}
{/if}

<!-- Flying Symbols -->
{#each flyingSymbols as symbol}
	<T.Group
		position.x={symbol.x}
		position.y={symbol.y}
		position.z={symbol.z}
		rotation.z={symbol.rotation}
		scale={symbol.scale}
	>
		<HTML
			transform
			occlude
			position.y={0}
			style="opacity: {symbol.opacity}; font-size: 2em; color: {theme.colors.primary};"
		>
			{symbol.symbol}
		</HTML>
	</T.Group>
{/each}

<!-- Multiplier Texts -->
{#each multiplierTexts as text}
	<T.Group position.x={text.x} position.y={text.y} position.z={text.z} scale={text.scale}>
		<HTML
			transform
			occlude
			position.y={0}
			style="opacity: {text.opacity}; font-size: 3em; color: {theme.colors
				.secondary}; font-weight: bold;"
		>
			{text.value}
		</HTML>
	</T.Group>
{/each}

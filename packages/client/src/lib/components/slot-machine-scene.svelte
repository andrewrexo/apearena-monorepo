<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { HTML, OrbitControls } from '@threlte/extras';
	import { spring } from 'svelte/motion';
	import { onDestroy, onMount } from 'svelte';

	import theme from '$lib/state/theme.svelte';
	import Reel from './game/slots/reel.svelte';
	import GameText from './game/slots/game-text.svelte';

	let { reels = [], spinning = false, showParticles = true, sceneActions = $bindable() } = $props();

	let particles = $state(
		Array(40)
			.fill(null)
			.map(() => ({
				x: Math.random() * 10 - 5,
				y: Math.random() * 10 - 5,
				z: Math.random() * 5,
				scale: Math.random() * 0.5 + 0.5,
				speed: Math.random() * 2 + 1,
				color: theme.colors.primary,
				rotationSpeed: Math.random() * 2 - 1,
				rotation: Math.random() * Math.PI * 2
			}))
	);

	const rotationSpring = spring(
		{ x: 0, y: 0, z: 0 },
		{
			stiffness: 0.05,
			damping: 0.5
		}
	);

	// Update these constants
	const REEL_RADIUS = 0.925;
	const SYMBOL_COUNT = 5;
	const REEL_SPACING = 2;
	const POSITION_EPSILON = 0.25; // Threshold for considering position reached

	const jackpotScale = spring(1, {
		stiffness: 0.05,
		damping: 0.2
	});

	let cameraShakeActive = $state(false);

	function shakeCamera(intensity = 0.5) {
		cameraShake.intensity = intensity;
		cameraShakeActive = true;
	}

	function spawnMultiplierTrail(multiplier: number) {
		multiplierTrail.active = true;
		multiplierTrail.points = Array(20)
			.fill(null)
			.map((_, i) => ({
				x: (Math.random() - 0.5) * 4,
				y: -1 + i * 0.2,
				z: Math.random() * 2,
				opacity: 1
			}));
	}

	useTask((delta: number) => {
		if (spinning) {
			reels = reels.map((reel) => {
				if (reel.speed === 0) return reel;

				// Simple linear interpolation to target
				const newPosition = reel.position + reel.speed * delta;

				return {
					...reel,
					position: newPosition
				};
			});
		}

		// Camera shake update
		if (cameraShakeActive && cameraShake.intensity > 0.01) {
			cameraShake.offset = {
				x: (Math.random() - 0.5) * cameraShake.intensity,
				y: (Math.random() - 0.5) * cameraShake.intensity,
				z: 0
			};
			cameraShake.intensity *= cameraShake.decay;
			cameraPosition.set({
				x: cameraShake.offset.x,
				y: cameraShake.offset.y,
				z: 8 + cameraShake.offset.z
			});

			if (cameraShake.intensity <= 0.01) {
				cameraShakeActive = false;
			}
		}

		// Multiplier trail update
		if (multiplierTrail.active) {
			multiplierTrail.points = multiplierTrail.points
				.map((p) => ({
					...p,
					y: p.y + delta * 2,
					opacity: p.opacity * 0.95
				}))
				.filter((p) => p.opacity > 0.01);

			if (multiplierTrail.points.length === 0) {
				multiplierTrail.active = false;
			}
		}

		// Other animations
		const currentTime = Date.now() * 0.001;

		rotationSpring.set({
			x: 0.2 + Math.sin(currentTime) * 0.03,
			y: Math.cos(currentTime * 2) * 0.05,
			z: Math.sin(currentTime) * 0.02
		});

		jackpotScale.set(1 + Math.sin(currentTime * 1) * 0.1);

		// Particle updates
		if (showParticles && particles.some((p) => p.scale > 0.01)) {
			particles = particles
				.map((p) => ({
					...p,
					y: p.y + p.speed * delta,
					scale: p.scale * 0.99
				}))
				.filter((p) => p.scale > 0.01);
		}

		// Update flying symbols
		if (flyingSymbols.length > 0) {
			flyingSymbols = flyingSymbols
				.map((symbol) => ({
					...symbol,
					y: symbol.y + symbol.speed * delta,
					rotation: symbol.rotation + symbol.rotationSpeed * delta,
					opacity: symbol.opacity * 0.98,
					scale: symbol.scale * 0.99
				}))
				.filter((symbol) => symbol.opacity > 0.01);
		}

		// Update multiplier texts
		if (multiplierTexts.length > 0) {
			multiplierTexts = multiplierTexts
				.map((text) => ({
					...text,
					y: text.y + text.speed * delta,
					opacity: text.opacity * 0.97,
					scale: text.scale * 1.02
				}))
				.filter((text) => text.opacity > 0.01);
		}
	});

	const armSpring = spring(
		{ rotation: 0 },
		{
			stiffness: 0.3,
			damping: 0.5
		}
	);

	let windowWidth = $state(0);

	onMount(() => {
		windowWidth = window.innerWidth;

		const handleResize = () => {
			windowWidth = window.innerWidth;
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	onMount(() => {
		showParticles = true;

		setTimeout(() => {
			showParticles = false;
		}, 3200);
	});

	onDestroy(() => {
		particles = [];
		rotationSpring.set({ x: 0, y: 0, z: 0 });
		armSpring.set({ rotation: 0 });
	});

	let cameraShake = $state({
		intensity: 0,
		decay: 0.9,
		offset: { x: 0, y: 0, z: 0 }
	});

	const cameraPosition = spring(
		{ x: 0, y: 0, z: 8 },
		{
			stiffness: 0.3,
			damping: 0.5
		}
	);

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

	// Add these new state variables near the top with other state declarations
	let flyingSymbols = $state([]);
	let multiplierTexts = $state([]);

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
	position={[$cameraPosition.x, $cameraPosition.y, $cameraPosition.z]}
	makeDefault
	fov={45}
/>

<T.Group
	position.y={2.4}
	position.z={0.5}
	scale={$jackpotScale}
	rotation.x={$rotationSpring.x}
	rotation.y={$rotationSpring.y}
	rotation.z={$rotationSpring.z}
>
	<GameText text="JACKPOT" />
</T.Group>

<T.Group position.y={-0.5}>
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

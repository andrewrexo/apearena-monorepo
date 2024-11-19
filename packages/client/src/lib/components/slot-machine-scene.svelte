<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { HTML, OrbitControls } from '@threlte/extras';
	import { spring } from 'svelte/motion';
	import { onDestroy, onMount } from 'svelte';

	import theme from '$lib/state/theme.svelte';
	import Reel from './game/slots/reel.svelte';

	let { reels = [], spinning = false, showParticles = true } = $props();

	let particles = $state(
		Array(30)
			.fill(null)
			.map(() => ({
				x: Math.random() * 10 - 5,
				y: Math.random() * 10 - 5,
				z: Math.random() * 5,
				scale: Math.random() * 0.5 + 0.5,
				speed: Math.random() * 2 + 1
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

	useTask((delta: number) => {
		if (spinning) {
			reels = reels.map((reel, reelIndex) => {
				if (reel.speed === 0) return reel;

				const distanceToTarget = reel.targetPosition - reel.position;
				if (Math.abs(distanceToTarget) < POSITION_EPSILON) {
					return {
						...reel,
						position: Math.round(reel.targetPosition),
						speed: 0
					};
				}

				return {
					...reel,
					position: reel.position + reel.speed * delta * 2
				};
			});

			const currentTime = Date.now() * 0.001;

			rotationSpring.set({
				x: 0.2 + Math.sin(currentTime) * 0.03,
				y: Math.cos(currentTime * 2) * 0.05,
				z: Math.sin(currentTime) * 0.02
			});

			jackpotScale.set(1 + Math.sin(currentTime * 1) * 0.1);
		}

		if (showParticles && particles.some((p) => p.scale > 0.01)) {
			particles = particles
				.map((p) => ({
					...p,
					y: p.y + p.speed * delta,
					scale: p.scale * 0.99
				}))
				.filter((p) => p.scale > 0.01);
		}
	});

	const armSpring = spring(
		{ rotation: 0 },
		{
			stiffness: 0.3,
			damping: 0.5
		}
	);

	function animateArm() {
		armSpring.set({ rotation: Math.PI / 2 });
		setTimeout(() => {
			armSpring.set({ rotation: 0 });
		}, 500);
	}

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

	let jackpotFontSize = $derived(windowWidth < 500 ? 24 : 24);

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
</script>

<T.PerspectiveCamera position={[0, 0, 8]} makeDefault fov={45}></T.PerspectiveCamera>

<T.Group position.y={-0.5} rotation.x={Math.PI / 1.4}>
	<!-- Update lighting -->

	<T.Group
		rotation.x={$rotationSpring.x}
		rotation.y={$rotationSpring.y}
		rotation.z={$rotationSpring.z}
	>
		<Reel {reels} radius={REEL_RADIUS} symbols={SYMBOL_COUNT} epsilon={POSITION_EPSILON} />
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
		>
			<T.SphereGeometry args={[0.1, 8, 8]} />
			<T.MeshStandardMaterial
				color={theme.colors.primary}
				emissive={theme.colors.secondary}
				emissiveIntensity={3}
				transparent={true}
				opacity={0.8}
			/>
		</T.Mesh>
	{/each}
{/if}

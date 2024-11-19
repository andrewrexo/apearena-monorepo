<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { HTML } from '@threlte/extras';
	import { spring } from 'svelte/motion';
	import { onDestroy, onMount } from 'svelte';
	import { hslToString, hslToStringWithOpacity } from '$lib/formatters';
	import theme from '$lib/state/theme.svelte';

	let { pullArm = $bindable(), reels = [], spinning = false, showParticles = true } = $props();

	let primaryColor = $derived(hslToString(theme.primaryColor));
	let secondaryColor = $derived(hslToString(theme.secondaryColor));
	let primaryColorOpaque = $derived(hslToStringWithOpacity(theme.primaryColor, 0.5));

	let particles = $state(
		Array(50)
			.fill(null)
			.map(() => ({
				x: Math.random() * 20 - 10,
				y: Math.random() * 15 - 5,
				z: Math.random() * 2,
				scale: Math.random() * 0.5 + 0.25,
				speed: Math.random() * 10 + 1
			}))
	);

	const rotationSpring = spring(
		{ x: 0, y: 0, z: 0 },
		{
			stiffness: 0.05,
			damping: 0.5
		}
	);

	const symbolGlow = spring(0, {
		stiffness: 0.2,
		damping: 0.3
	});

	// Update these constants
	const REEL_RADIUS = 1;
	const SYMBOL_COUNT = 5;
	const ANGLE_PER_SYMBOL = (2 * Math.PI) / SYMBOL_COUNT;
	const REEL_SPACING = 2.4;
	const POSITION_EPSILON = 0.25; // Threshold for considering position reached

	function getSymbolPosition(basePosition: number, index: number) {
		const angle = (basePosition + index) * ANGLE_PER_SYMBOL;
		return {
			x: 0,
			y: REEL_RADIUS * Math.sin(angle),
			z: REEL_RADIUS * Math.cos(angle),
			rotation: -angle,
			scale: 1
		};
	}

	// Add visual effects
	const reelLightIntensity = spring(0.5, {
		stiffness: 0.1,
		damping: 0.1
	});

	const cabinetGlow = spring(0, {
		stiffness: 0.1,
		damping: 0.1
	});

	// Enhanced animation system
	useTask((delta: number) => {
		if (spinning) {
			reels = reels.map((reel, reelIndex) => {
				if (reel.speed === 0) return reel; // Skip static reels

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

			// Batch spring updates
			const time = Date.now() * 0.001;
			rotationSpring.set({
				x: 0.2 + Math.sin(time) * 0.03,
				y: Math.cos(time * 2) * 0.05,
				z: Math.sin(time) * 0.02
			});
		}

		// Only update particles if they're visible
		if (showParticles && particles.some((p) => p.scale > 0.01)) {
			particles = particles
				.map((p) => ({
					...p,
					y: p.y + p.speed * delta,
					scale: p.scale * 0.99
				}))
				.filter((p) => p.scale > 0.01); // Remove tiny particles
		}
	});

	// Add arm animation spring
	const armSpring = spring(
		{ rotation: 0 },
		{
			stiffness: 0.3,
			damping: 0.5
		}
	);

	// Add arm pull animation
	function animateArm() {
		armSpring.set({ rotation: Math.PI / 2 });
		setTimeout(() => {
			armSpring.set({ rotation: 0 });
		}, 500);
	}

	// Expose arm pull function
	pullArm = animateArm;

	onMount(() => {
		showParticles = true;

		setTimeout(() => {
			showParticles = false;
		}, 3200);
	});

	onDestroy(() => {
		// Clean up any Three.js resources
		particles = [];
		// Reset springs
		rotationSpring.set({ x: 0, y: 0, z: 0 });
		armSpring.set({ rotation: 0 });
	});
</script>

<!-- Update the camera -->
<T.PerspectiveCamera position={[0, 0, 9]} makeDefault fov={45} />

<T.Group position.y={0.5}>
	<T.AmbientLight intensity={0.2} />
	<T.SpotLight
		position={[10, 4, 5]}
		intensity={400}
		angle={1}
		penumbra={0}
		decay={2}
		color={primaryColor}
	/>

	<T.Group
		rotation.x={$rotationSpring.x}
		rotation.y={$rotationSpring.y}
		rotation.z={$rotationSpring.z}
	>
		<!-- Main Cabinet -->
		<T.Group>
			<!-- Main cabinet with updated materials -->
			<T.Mesh position.z={-1}>
				<T.BoxGeometry args={[7, 5, 1]} />
				<T.MeshToonMaterial
					color={primaryColor}
					emissive={secondaryColor}
					emissiveIntensity={0.1}
				/>
			</T.Mesh>
		</T.Group>

		<!-- Side Panels -->
		<T.Mesh position.x={3.6} position.z={0} receiveShadow castShadow>
			<T.BoxGeometry args={[0.2, 5, 1]} />
			<T.MeshToonMaterial color={primaryColor} />
		</T.Mesh>
		<T.Mesh position.x={-3.6} position.z={0} receiveShadow castShadow>
			<T.BoxGeometry args={[0.2, 5, 1]} />
			<T.MeshToonMaterial color={primaryColor} />
		</T.Mesh>

		<!-- Bottom Panel -->
		<T.Mesh position.y={-2.8} position.z={0.2}>
			<T.BoxGeometry args={[7.4, 0.6, 1.4]} />
			<T.MeshToonMaterial
				color={primaryColor}
				emissive={primaryColor}
				emissiveIntensity={$rotationSpring.x}
			/>
		</T.Mesh>

		<!-- Reel Section -->
		<T.Group position={[0, 0, 0]}>
			{#each reels as reel, i}
				<!-- Enhanced reel visuals -->
				<T.Group position={[REEL_SPACING * (i - 1), 0, 0]}>
					<!-- Add reflection plane -->

					<!-- Symbol display -->
					<T.Group rotation.x={reel.position * ANGLE_PER_SYMBOL}>
						{#each reel.symbols as symbol, j}
							{@const pos = getSymbolPosition(0, j)}
							<T.Group position={[0, pos.y, pos.z]} rotation.x={pos.rotation}>
								<HTML
									transform
									occlude={false}
									style="
										width: 64px;
										height: 64px;
										display: flex;
                    position: relative;
										align-items: center;
										justify-content: center;
										font-size: 32px;
										color: #ffffff;
										transform-style: preserve-3d;
										border: 2px solid rgba(255, 255, 255, 0.15);
										border-radius: 6px;
										text-shadow: 
											2px 2px 0 rgba(0, 0, 0, 0.2),
											0 0 10px rgba(255, 255, 255, 0.5);
										font-family: 'Inter', system-ui, sans-serif;
										font-weight: 700;
										background-image: 
											linear-gradient(
												135deg,
												rgba(255, 255, 255, 0.1) 0%,
												transparent 100%
											),
											repeating-linear-gradient(
												0deg,
												rgba(255, 255, 255, 0.05) 0px,
												rgba(255, 255, 255, 0.05) 1px,
												transparent 1px,
												transparent 2px
											);
										background-color: {primaryColorOpaque};
										bg-opacity: 0.5;
										transition: all 0.5s ease;
									"
								>
									{symbol}
								</HTML>
							</T.Group>
						{/each}
					</T.Group>
				</T.Group>
			{/each}
		</T.Group>

		<!-- Add Slot Machine Arm -->
		<T.Group position.x={4} position.y={0.5} position.z={0.5}>
			<!-- Arm Base -->
			<T.Mesh receiveShadow castShadow>
				<T.CylinderGeometry args={[0.15, 0.15, 0.3, 8]} />
				<T.MeshStandardMaterial color={secondaryColor} metalness={0.7} roughness={0.2} />
			</T.Mesh>

			<!-- Arm Handle -->
			<T.Group rotation.z={$armSpring.rotation}>
				<!-- Main Arm -->
				<T.Mesh position.y={-0.6} receiveShadow castShadow>
					<T.CylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
					<T.MeshStandardMaterial color={secondaryColor} metalness={0.7} roughness={0.2} />
				</T.Mesh>

				<!-- Handle Knob -->
				<T.Mesh position.y={-1.2} receiveShadow castShadow>
					<T.SphereGeometry args={[0.15, 16, 16]} />
					<T.MeshStandardMaterial color={secondaryColor} metalness={0.8} roughness={0.2} />
				</T.Mesh>
			</T.Group>
		</T.Group>
	</T.Group>
</T.Group>

<!-- Win celebration particles -->
{#if showParticles}
	{#each particles as particle}
		<T.Mesh
			position={[particle.x, particle.y, particle.z]}
			scale={[particle.scale, particle.scale, particle.scale]}
		>
			<T.SphereGeometry args={[0.1, 8, 8]} />
			<T.MeshStandardMaterial color={primaryColor} emissive={primaryColor} emissiveIntensity={2} />
		</T.Mesh>
	{/each}
{/if}

<style lang="postcss">
	@keyframes pulse {
		0%,
		100% {
			filter: brightness(1) contrast(1);
		}
		50% {
			filter: brightness(1.1) contrast(1.05);
		}
	}
</style>

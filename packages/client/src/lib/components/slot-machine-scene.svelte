<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { spring } from 'svelte/motion';
	import { ContactShadows, HTML } from '@threlte/extras';
	import { onMount } from 'svelte';
	import { hslToString } from '$lib/formatters';
	import theme from '$lib/state/theme.svelte';
	import { MeshToonMaterial } from 'three';

	let { pullArm = $bindable(), reels = [], spinning = false, showParticles = true } = $props();

	let primaryColor = $derived(hslToString(theme.primaryColor));
	let secondaryColor = $derived(hslToString(theme.secondaryColor));

	// Win celebration effects
	let particleCount = $state(30);
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
				let newPosition = reel.position;
				let newSpeed = reel.speed;

				const distanceToTarget = reel.targetPosition - reel.position;

				// Check if this reel should be moving
				if (distanceToTarget > 0) {
					if (distanceToTarget < POSITION_EPSILON) {
						newPosition = Math.round(reel.targetPosition);
						newSpeed = 0;
					} else {
						newPosition = reel.position + newSpeed * delta * 2;
					}
				}

				return {
					...reel,
					position: newPosition,
					speed: newSpeed
				};
			});

			reelLightIntensity.set(1);
			cabinetGlow.set(0.1);
			symbolGlow.set(0.8);
			cabinetGlow.set(0.3);
		} else {
			reels = reels.map((reel) => ({
				...reel,
				position: Math.round(reel.position)
			}));
		}

		if (spinning) {
			rotationSpring.set({
				x: 0.2 + Math.sin(Date.now() * 0.001) * 0.03,
				y: Math.cos(Date.now() * 0.002) * 0.05,
				z: Math.sin(Date.now() * 0.001) * 0.02
			});
		} else {
			rotationSpring.set({ x: 0.2, y: 0, z: 0 });
		}

		// Update particles
		if (showParticles) {
			particles = particles.map((p) => ({
				...p,
				y: p.y + p.speed * delta,
				scale: p.scale * 0.99
			}));
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
		}, 2000);
	});
</script>

<T.PerspectiveCamera position={[0, 0, 11]} makeDefault fov={45} />

<T.Group position.y={1}>
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
									receiveShadow
									castShadow
									style="background: oklch(var(--p)); 
                  width: 60px;
										   height: 60px;
										   display: flex;
										   align-items: center;
										   justify-content: center;
										   font-size: 30px;
										   color: #ffffff;
										   transform-style: preserve-3d;
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
	/* Add some CSS glow effects */
	:global(.symbol-container) {
		filter: drop-shadow(0 0 10px rgba(var(--primary-rgb), 0.5));
		transition: filter 0.3s ease;
	}

	:global(.spinning .symbol-container) {
		filter: drop-shadow(0 0 20px rgba(var(--primary-rgb), 0.8));
	}
</style>

<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { spring } from 'svelte/motion';
	import * as THREE from 'three';
	import { HTML } from '@threlte/extras';
	import { MeshStandardMaterial } from 'three';

	let { pullArm = $bindable(), reels = [], spinning = false, showParticles = true } = $props();

	const chromeMaterial = {
		color: '#ffffff',
		metalness: 0.9,
		roughness: 0.1,
		envMapIntensity: 1
	};

	const glowMaterial = {
		color: '#ffaa00',
		emissive: '#ff6600',
		emissiveIntensity: 0.5,
		metalness: 0.8,
		roughness: 0.2
	};

	const rotationSpring = spring(
		{ x: 0, y: 0, z: 0 },
		{
			stiffness: 0.1,
			damping: 1
		}
	);

	// Update these constants
	const REEL_RADIUS = 1;
	const SYMBOL_COUNT = 5;
	const ANGLE_PER_SYMBOL = (2 * Math.PI) / SYMBOL_COUNT;
	const REEL_SPACING = 2.4;
	const POSITION_EPSILON = 0.01; // Threshold for considering position reached

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
		damping: 0.5
	});

	const cabinetGlow = spring(0, {
		stiffness: 0.1,
		damping: 0.5
	});

	// Create particle system
	const particleCount = 1000;
	const particleGeometry = new THREE.BufferGeometry();
	const particlePositions = new Float32Array(particleCount * 3);
	const particleVelocities = new Float32Array(particleCount * 3);

	// Initialize particle positions and velocities
	for (let i = 0; i < particleCount * 3; i += 3) {
		particlePositions[i] = (Math.random() - 0.5) * 10;
		particlePositions[i + 1] = Math.random() * 10;
		particlePositions[i + 2] = (Math.random() - 0.5) * 10;

		particleVelocities[i] = (Math.random() - 0.5) * 0.2;
		particleVelocities[i + 1] = Math.random() * 0.2;
		particleVelocities[i + 2] = (Math.random() - 0.5) * 0.2;
	}

	particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

	const particleMaterial = new THREE.PointsMaterial({
		size: 0.1,
		color: 0xffaa00,
		transparent: true,
		blending: THREE.AdditiveBlending,
		opacity: 0.8
	});

	let particles: THREE.Points;

	// Replace useFrame with useTask for particle animation
	useTask((delta: number) => {
		if (!showParticles || !particles) return;

		const positions = particles.geometry.attributes.position.array as Float32Array;

		for (let i = 0; i < positions.length; i += 3) {
			positions[i] += particleVelocities[i] * delta * 10;
			positions[i + 1] += particleVelocities[i + 1] * delta * 10;
			positions[i + 2] += particleVelocities[i + 2] * delta * 10;

			// Reset particles that fall below a certain point
			if (positions[i + 1] < -5) {
				positions[i + 1] = 10;
				positions[i] = (Math.random() - 0.5) * 10;
				positions[i + 2] = (Math.random() - 0.5) * 10;
			}
		}

		particles.geometry.attributes.position.needsUpdate = true;
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
		} else {
			reels = reels.map((reel) => ({
				...reel,
				position: Math.round(reel.position)
			}));

			reelLightIntensity.set(0);
			cabinetGlow.set(0);
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
</script>

<T.Group position.y={10}>
	<T.PerspectiveCamera position={[0, -1.5, 12]} makeDefault fov={45} />

	<!-- Lighting -->
	<T.AmbientLight intensity={0.7} />
	<T.SpotLight
		position={[0, -1.5, 12]}
		intensity={2}
		castShadow
		angle={THREE.MathUtils.degToRad(45)}
		penumbra={0.5}
		shadow-bias={-0.0001}
	/>

	<T.Group
		rotation.x={$rotationSpring.x}
		rotation.y={$rotationSpring.y}
		rotation.z={$rotationSpring.z}
	>
		<!-- Main Cabinet -->
		<T.Mesh position.z={-0.5} receiveShadow castShadow>
			<T.BoxGeometry args={[7, 5, 1]} />
			<T.MeshStandardMaterial {...chromeMaterial} />
		</T.Mesh>

		<!-- Top Decoration -->
		<T.Mesh position.y={2.8} position.z={0} receiveShadow castShadow>
			<T.CylinderGeometry args={[0.3, 0.5, 0.5, 8]} />
			<T.MeshStandardMaterial {...glowMaterial} />
		</T.Mesh>

		<!-- Side Panels -->
		<T.Mesh position.x={3.6} position.z={0} receiveShadow castShadow>
			<T.BoxGeometry args={[0.2, 5, 1]} />
			<T.MeshStandardMaterial {...chromeMaterial} />
		</T.Mesh>
		<T.Mesh position.x={-3.6} position.z={0} receiveShadow castShadow>
			<T.BoxGeometry args={[0.2, 5, 1]} />
			<T.MeshStandardMaterial {...chromeMaterial} />
		</T.Mesh>

		<!-- Bottom Panel -->
		<T.Mesh position.y={-2.8} position.z={0.2} receiveShadow castShadow>
			<T.BoxGeometry args={[7.4, 0.6, 1.4]} />
			<T.MeshStandardMaterial {...glowMaterial} />
		</T.Mesh>

		<!-- Reel Window Frame -->
		<T.Mesh position.z={0.2} receiveShadow castShadow>
			<T.BoxGeometry args={[6.8, 3, 0.2]} />
			<T.MeshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.2} />
		</T.Mesh>

		<!-- Glass Panel -->
		<T.Mesh position.z={0.3} receiveShadow>
			<T.BoxGeometry args={[6.6, 2.8, 0.05]} />
			<T.MeshPhysicalMaterial
				transmission={0.95}
				thickness={0.05}
				roughness={0}
				ior={0.1}
				opacity={1}
				transparent={true}
			/>
		</T.Mesh>

		<!-- Reel Section -->
		<T.Group position={[0, 0.5, 0]}>
			{#each reels as reel, i}
				<!-- Enhanced reel visuals -->
				<T.Group position={[REEL_SPACING * (i - 1), 0, 0]}>
					<!-- Add reflection plane -->
					<T.Mesh position={[0, 0, -0.1]} rotation.x={-Math.PI / 2}>
						<T.PlaneGeometry args={[1.8, 0.5]} />
						<T.MeshPhysicalMaterial
							metalness={1}
							roughness={0.2}
							envMapIntensity={1}
							clearcoat={1}
						/>
					</T.Mesh>

					<!-- Symbol display -->
					<T.Group rotation.x={reel.position * ANGLE_PER_SYMBOL}>
						{#each reel.symbols as symbol, j}
							{@const pos = getSymbolPosition(0, j)}
							<T.Group position={[0, pos.y, pos.z]} rotation.x={pos.rotation}>
								<HTML
									center
									transform
									occlude={false}
									style="background: linear-gradient(145deg, #2a2a2a, #1a1a1a); 
										   border: 2px solid #3a3a3a;
										   width: 60px;
										   height: 60px;
										   display: flex;
										   align-items: center;
										   justify-content: center;
										   border-radius: 8px;
										   font-size: 32px;
										   box-shadow: 0 4px 8px rgba(0,0,0,0.5),
													     inset 0 2px 4px rgba(255,255,255,0.1);
										   transform-style: preserve-3d;"
								>
									{symbol}
								</HTML>
							</T.Group>
						{/each}
					</T.Group>
				</T.Group>
			{/each}
		</T.Group>

		<!-- Decorative Lights -->
		{#each Array(5) as _, i}
			<T.Mesh position.x={-3 + i * 1.5} position.y={2} position.z={0.5} receiveShadow castShadow>
				<T.SphereGeometry args={[0.15]} />
				<T.MeshStandardMaterial
					color="#ff3300"
					emissive="#ff0000"
					emissiveIntensity={spinning ? 1 : 0.3}
				/>
			</T.Mesh>
		{/each}

		<!-- Add Slot Machine Arm -->
		<T.Group position.x={4} position.y={1} position.z={0.5}>
			<!-- Arm Base -->
			<T.Mesh receiveShadow castShadow>
				<T.CylinderGeometry args={[0.15, 0.15, 0.3, 8]} />
				<T.MeshStandardMaterial color="#cc0000" metalness={0.7} roughness={0.2} />
			</T.Mesh>

			<!-- Arm Handle -->
			<T.Group rotation.z={$armSpring.rotation}>
				<!-- Main Arm -->
				<T.Mesh position.y={-0.6} receiveShadow castShadow>
					<T.CylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
					<T.MeshStandardMaterial color="#cc0000" metalness={0.7} roughness={0.2} />
				</T.Mesh>

				<!-- Handle Knob -->
				<T.Mesh position.y={-1.2} receiveShadow castShadow>
					<T.SphereGeometry args={[0.15, 16, 16]} />
					<T.MeshStandardMaterial color="#ffcc00" metalness={0.8} roughness={0.2} />
				</T.Mesh>
			</T.Group>
		</T.Group>
	</T.Group>

	<!-- Win particles -->
	{#if showParticles}
		<T.Points bind:ref={particles} geometry={particleGeometry} material={particleMaterial} />
	{/if}
</T.Group>

<style>
	:global(.symbol-container) {
		background: linear-gradient(to bottom, #2a2a2a, #1a1a1a);
		border: 2px solid #3a3a3a;
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		font-size: 40px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
	}
</style>

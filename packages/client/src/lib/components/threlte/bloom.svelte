<script lang="ts">
	import {
		BloomEffect,
		EffectComposer,
		EffectPass,
		KernelSize,
		RenderPass,
		SMAAEffect,
		SMAAPreset,
		BlendFunction
	} from 'postprocessing';
	import { useThrelte } from '@threlte/core';
	import type { Camera, Scene, WebGLRenderer } from 'three';
	import { onMount } from 'svelte';

	const { scene, renderer, camera } = useThrelte();
	const composer = new EffectComposer(renderer as WebGLRenderer);

	const setupEffectComposer = (camera: Camera, scene: Scene) => {
		composer.removeAllPasses();
		composer.addPass(new RenderPass(scene, camera));
		composer.addPass(
			new EffectPass(
				camera,
				new BloomEffect({
					blendFunction: BlendFunction.ADD,
					intensity: 1.5,
					luminanceThreshold: 0.4,
					luminanceSmoothing: 0.3,
					mipmapBlur: true,
					kernelSize: KernelSize.MEDIUM,
					resolutionScale: 0.7,
					height: 480,
					width: 480,
					radius: 0.85,
					levels: 5
				})
			)
		);
		composer.addPass(
			new EffectPass(
				camera,
				new SMAAEffect({
					preset: SMAAPreset.MEDIUM
				})
			)
		);
	};

	onMount(() => {
		setupEffectComposer($camera, scene);
	});

	let frameHandle: number;
	const render = () => {
		composer.render();
		frameHandle = requestAnimationFrame(render);
	};

	onMount(() => {
		render();
		return () => {
			cancelAnimationFrame(frameHandle);
		};
	});
</script>

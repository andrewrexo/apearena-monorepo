<div class="absolute inset-0 opacity-20">
	{#each Array(50) as _, i}
		<div
			class="animate-twinkle absolute h-1 w-1 rounded-full bg-white"
			style="left: {Math.random() * 100}vw; 
           top: {Math.random() * 100}vh;
           animation-delay: {Math.random() * 2}s"
		></div>
	{/each}
</div>

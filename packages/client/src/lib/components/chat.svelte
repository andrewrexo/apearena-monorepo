<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let messages = $state<Array<{ id: string; text: string; username: string; timestamp: Date }>>([]);
	let chatInput = $state('');

	function sendMessage(e: Event) {
		e.preventDefault();
		if (!chatInput.trim()) return;

		messages = [
			...messages,
			{
				id: crypto.randomUUID(),
				text: chatInput,
				username: '0x' + Math.random().toString(16).slice(2, 18),
				timestamp: new Date()
			}
		];

		chatInput = '';
	}

	// Auto-scroll to bottom when new messages arrive
	let chatContainer: HTMLDivElement;

	$effect(() => {
		if (messages.length) {
			setTimeout(() => {
				chatContainer?.scrollTo({
					top: chatContainer.scrollHeight,
					behavior: 'smooth'
				});
			}, 0);
		}
	});

	onMount(() => {
		messages = [
			...messages,
			{
				id: crypto.randomUUID(),
				text: 'Welcome to the chat! this is a test message',
				username: '0x' + Math.random().toString(16).slice(2, 18), // This should come from your auth system
				timestamp: new Date()
			}
		];
	});
</script>

<div class="flex h-[260px] w-full flex-col">
	<div
		class="border-tl-lg border-tr-lg bg-base-300 h-full space-y-2 overflow-y-auto rounded-t-lg bg-opacity-30 p-2 px-4"
		bind:this={chatContainer}
	>
		{#each messages as message (message.id)}
			<div class="message">
				<div class="flex items-baseline gap-2 text-xs">
					<span class="font-medium">{message.username}</span>
					<span class="text-xs text-neutral-500">
						{message.timestamp.toLocaleTimeString()}
					</span>
				</div>
				<div class="chat rounded p-0 text-sm" transition:fly={{ y: -40, duration: 300 }}>
					<div
						class="flex w-[calc(100dvw-4.5rem)] items-center break-all pr-1 text-sm opacity-90 md:w-[calc(100dvw-20rem)]"
					>
						{message.text}
					</div>
				</div>
			</div>
		{/each}
	</div>
	<form class="mt-0 flex w-full gap-1" onsubmit={sendMessage}>
		<label
			for="chat-input"
			class="input input-md input-primary bg-base-300 flex flex-1 items-center rounded-none rounded-b-lg border-none bg-opacity-40 px-4 text-sm text-neutral-300 outline-none placeholder:text-neutral-300"
		>
			<input
				class="w-full"
				id="chat-input"
				type="text"
				bind:value={chatInput}
				placeholder="Type a message..."
			/>
			<button type="submit" class="btn btn-md text-primary btn-link">Send</button>
		</label>
	</form>
</div>

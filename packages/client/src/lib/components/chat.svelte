<script lang="ts">
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
				username: '0x' + Math.random().toString(16).slice(2, 18), // This should come from your auth system
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
</script>

<div class="flex h-full w-full flex-col">
	<div
		class="h-[290px] space-y-2 overflow-y-auto rounded-lg bg-black bg-opacity-30 p-4"
		bind:this={chatContainer}
	>
		{#each messages as message (message.id)}
			<div class="flex items-baseline gap-2 text-xs">
				<span class="text-neutral-300">{message.username}</span>
				<span class="text-xs text-neutral-500">
					{message.timestamp.toLocaleTimeString()}
				</span>
			</div>
			<div class="chat rounded p-0 text-xs" transition:fly={{ y: -40, duration: 300 }}>
				<div
					class="chat-bubble chat-bubble-primary flex max-w-[80%] items-center break-all text-neutral-200"
				>
					{message.text}
				</div>
			</div>
		{/each}
	</div>

	<form class="mt-2 flex w-full gap-1" onsubmit={sendMessage}>
		<input
			type="text"
			bind:value={chatInput}
			placeholder="Type a message..."
			class=" input input-md bg-primary min-w-0 flex-1 rounded-lg bg-opacity-20 px-2 text-sm text-neutral-300"
		/>
		<button type="submit" class=" btn btn-md bg-primary bg-opacity-50 font-bold text-white">
			Send
		</button>
	</form>
</div>

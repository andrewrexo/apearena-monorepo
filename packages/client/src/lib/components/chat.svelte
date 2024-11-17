<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';

	import gameClient from '$lib/game/client';
	import globalChatState from '$lib/state/chat.svelte';

	let chatInput = $state('');

	function sendMessage(e: Event) {
		e.preventDefault();
		if (!chatInput.trim() || !gameClient.room) return;

		globalChatState.send(chatInput, { id: gameClient.room.sessionId });
		chatInput = '';
	}

	let chatContainer: HTMLDivElement;

	// Auto-scroll to bottom when new messages arrive
	$effect(() => {
		if (globalChatState.messages.length) {
			setTimeout(() => {
				chatContainer?.scrollTo({
					top: chatContainer.scrollHeight,
					behavior: 'smooth'
				});
			}, 0);
		}
	});

	onDestroy(() => {
		if (gameClient.room) {
			gameClient.room.leave();
		}
	});
</script>

<div class="flex h-[260px] w-full flex-col">
	<div
		class="border-tl-lg border-tr-lg bg-base-300 h-full space-y-2 overflow-y-auto rounded-t-lg bg-opacity-30 p-2 px-4"
		bind:this={chatContainer}
	>
		{#each globalChatState.messages as message (`${message.sessionId}-${message.timestamp}`)}
			<div class="message">
				<div class="flex items-baseline gap-2 text-xs">
					<span class="font-medium">{message.sessionId}</span>
					<span class="text-xs text-neutral-500">
						{new Date(message.timestamp).toLocaleTimeString()}
					</span>
				</div>
				<div class="chat rounded p-0 text-sm" transition:fly={{ y: -10, duration: 300 }}>
					<div
						class="flex w-[calc(100dvw-4.5rem)] items-center break-all pr-1 text-sm opacity-90 md:w-[calc(100dvw-20rem)]"
					>
						{message.content}
					</div>
				</div>
			</div>
		{/each}
	</div>
	<form class="mt-0 flex w-full gap-1" onsubmit={sendMessage}>
		<label
			for="chat-input"
			class="input input-md input-primary bg-base-300 flex flex-1 items-center rounded-b-lg rounded-t-none border-none bg-opacity-40 px-4 text-sm text-neutral-300 !outline-none ring-transparent focus:ring-0"
		>
			<input
				class="placeholder:text-base-content w-full"
				id="chat-input"
				type="text"
				bind:value={chatInput}
				placeholder="Type a message..."
			/>
			<button type="submit" class="btn btn-sm bg-opacity-50">Send</button>
		</label>
	</form>
</div>

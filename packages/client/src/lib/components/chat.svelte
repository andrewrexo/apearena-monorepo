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

	$effect(() => {
		if (globalChatState.messages.length) {
			requestAnimationFrame(() => {
				chatContainer?.scrollTo({
					top: chatContainer.scrollHeight,
					behavior: 'instant' // changed from 'smooth' to prevent page jumping
				});
			});
		}
	});

	onDestroy(() => {
		if (gameClient.room) {
			gameClient.room.leave();
		}
	});
</script>

<div class="flex h-[180px] w-full flex-col overflow-hidden transition-all duration-300">
	<div
		class="border-tl-lg b order-tr-lg
    bg-base-300 bg-opacity-30 h-full w-full space-y-2 overflow-y-auto scroll-smooth rounded-t-lg px-4 pb-4"
		bind:this={chatContainer}
	>
		{#each globalChatState.messages as message, index (`${message.sessionId}-${message.timestamp}-${index}`)}
			<div class="message w-full">
				<div class="flex items-baseline gap-2 text-xs">
					<span class="font-medium">{message.sessionId}</span>
					<span class="text-xs text-neutral-500">
						{new Date(message.timestamp).toLocaleTimeString()}
					</span>
				</div>
				<div class="chat w-full rounded p-0 text-sm" transition:fly={{ y: -10, duration: 300 }}>
					<div
						class="flex w-full flex-wrap items-center pr-1 text-sm text-wrap break-all opacity-90"
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
			class="input input-sm input-primary bg-base-300 bg-opacity-40 flex flex-1 items-center rounded-t-none rounded-b-lg border-none pl-4 text-sm text-neutral-300 ring-transparent !outline-none focus:ring-0"
		>
			<input
				class="placeholder:text-base-content w-full"
				id="chat-input"
				type="text"
				bind:value={chatInput}
				placeholder="Type a message..."
			/>
			<button type="submit" class="btn btn-xs bg-opacity-50">Send</button>
		</label>
	</form>
</div>

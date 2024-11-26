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

<div class="flex h-[170px] min-h-max w-full flex-col overflow-hidden">
	<div
		class="border-tl-lg border-tr-lg bg-base-100/80 h-full w-full space-y-2 overflow-y-auto scroll-smooth rounded-t-lg px-4 py-2"
		bind:this={chatContainer}
	>
		{#each globalChatState.messages as message, index (`${message.sessionId}-${message.timestamp}-${index}`)}
			<div class="message w-full">
				<div class="flex items-baseline gap-2 text-xs">
					<span class="font-medium">{message.sessionId}</span>
					<span class="text-xs">
						{new Date(message.timestamp).toLocaleTimeString()}
					</span>
				</div>
				<div class="chat w-full rounded-sm p-0 text-sm" transition:fly={{ y: -10, duration: 300 }}>
					<div class="flex w-full flex-wrap items-center pr-1 text-sm text-wrap break-all">
						{message.content}
					</div>
				</div>
			</div>
		{/each}
	</div>
	<form class="mt-0 flex w-full gap-1" onsubmit={sendMessage}>
		<label
			for="chat-input"
			class="input input-md input-primary bg-base-300/80 bg-opacity-40 flex min-w-full flex-1 items-center rounded-t-none rounded-b-lg border-none pl-4 text-sm ring-transparent outline-hidden! focus:ring-0"
		>
			<input
				class="w-full text-xs"
				id="chat-input"
				type="text"
				bind:value={chatInput}
				placeholder="say hello... or something"
			/>
		</label>
	</form>
</div>

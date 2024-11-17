import gameClient from '$lib/game/client';
import { Message as ServerMessage } from '../../../../server/src/rooms/schema/chat-room-state';

export const createChatState = () => {
	let messages = $state<ServerMessage[]>([]);

	const send = (message: string, metadata: Record<string, string> = {}) => {
		if (!message.trim() || !gameClient.room) return;
		// TODO validate message

		gameClient.room.send('chat', {
			content: message,
			...metadata
		});
	};

	const addMessage = (message: ServerMessage) => {
		messages = [...messages, message];
	};

	return {
		get messages() {
			return messages;
		},
		addMessage,
		send
	};
};

const globalChatState = createChatState();

export default globalChatState;

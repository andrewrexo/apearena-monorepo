import { statsState } from '$lib/state/stats.svelte';
import * as Colyseus from 'colyseus.js';

class GameClient {
	#colyseus: Colyseus.Client | null = null;
	#room: Colyseus.Room | null = null;

	host: string = 'ws://localhost:2567';

	constructor() {
		this.connect();
	}

	connect() {
		this.#colyseus = new Colyseus.Client(this.host);
	}

	setupHandlers() {
		if (!this.#room) {
			throw new Error('Room not joined');
		}

		this.#room.onMessage('world:stats', (message) => {
			statsState.updateConnectionCount(message);
		});
	}

	join(room: string) {
		if (!this.#colyseus) {
			throw new Error('Client not connected');
		}

		this.#colyseus
			.joinOrCreate(room)
			.then((room) => {
				console.log('joined room: ', room);
				this.#room = room;
				this.setupHandlers();
			})
			.catch((err) => {
				console.error('failed to join room: ', err);
			});
	}
}

const gameClient = new GameClient();

export default gameClient;

export const createStatsState = () => {
	let state = $state({
		connected: 0
	});

	return {
		get state() {
			return state;
		},
		get connected() {
			return state.connected;
		},
		updateConnectionCount(count: number) {
			state.connected = count;
		}
	};
};

export const statsState = createStatsState();

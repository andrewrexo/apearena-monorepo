export const createToastState = () => {
	let toastMessage = $state('');
	let showToast = $state(false);
	let isError = $state(false);

	const make = (message: string, duration = 3000, error = false) => {
		toastMessage = message;
		isError = error;
		showToast = true;
		setTimeout(() => {
			showToast = false;
		}, duration);
	};

	return {
		make,
		get showToast() {
			return showToast;
		},
		get toastMessage() {
			return toastMessage;
		},
		get isError() {
			return isError;
		},
		show() {
			showToast = true;
		},
		hide() {
			showToast = false;
		}
	};
};

export const toast = createToastState();

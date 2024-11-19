import type { THSL } from '$lib/color';
import { oklchStringToTLCH, oklchToRGB, rgbToHSL } from '$lib/color';

export const defaultTheme = 'sunset';

const createThemeState = () => {
	let currentTheme = $state('');
	let primaryColor = $state<THSL>({ h: 210, s: 100, l: 50 });
	let secondaryColor = $state<THSL>({ h: 25, s: 100, l: 50 });

	if (typeof document !== 'undefined') {
		currentTheme = document.body.getAttribute('data-theme') ?? defaultTheme;
	}

	function updateThemeColors() {
		if (document.documentElement) {
			const p = getComputedStyle(document.documentElement).getPropertyValue('--p').trim();
			const s = getComputedStyle(document.documentElement).getPropertyValue('--s').trim();

			// Convert OKLCH to RGB to HSL
			const pLCH = oklchStringToTLCH(p);
			const sLCH = oklchStringToTLCH(s);

			const pRGB = oklchToRGB(pLCH);
			const sRGB = oklchToRGB(sLCH);

			primaryColor = rgbToHSL(pRGB);
			secondaryColor = rgbToHSL(sRGB);
		}
	}

	return {
		get currentTheme() {
			return currentTheme;
		},
		set currentTheme(newTheme) {
			currentTheme = newTheme;
		},
		get primaryColor() {
			return primaryColor;
		},
		get secondaryColor() {
			return secondaryColor;
		},
		updateThemeColors
	};
};

const theme = createThemeState();
export default theme;

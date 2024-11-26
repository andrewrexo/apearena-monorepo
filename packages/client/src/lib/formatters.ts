import { oklchToRGB, rgbToHSL, type THSL, type TLCH, hslToRGB, rgbToRGBA } from './color';

export function formatCurrency(value: number) {
	return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function formatPercent(value: number) {
	return value.toLocaleString('en-US', { style: 'percent', maximumFractionDigits: 1 });
}

export function oklchToHSL(oklch: TLCH): THSL {
	const rgb = oklchToRGB(oklch);
	return rgbToHSL(rgb);
}

export function hslToString(hsl: THSL) {
	const { h, s, l } = hsl;
	return `hsl(${h.toFixed(0)}, ${s.toFixed(2)}%, ${l.toFixed(2)}%)`;
}

export const oklchStringToTLCH = (oklch: string): TLCH => {
	// Remove 'oklch(' and ')' and split the values
	const values = oklch.replace('oklch(', '').replace(')', '').split(' ');

	const [l, c, h] = values.map((value, index) => {
		const num = parseFloat(value);
		// For lightness (first value), convert from 0-100 to 0-1
		return index === 0 ? num / 100 : num;
	});

	return { l, c, h };
};

export function hslToRGBA(hsl: THSL, alpha: number): string {
	const rgb = hslToRGB(hsl);
	return rgbToRGBA(rgb, alpha);
}

export function hslToStringWithOpacity(hsl: THSL, alpha: number): string {
	return hslToRGBA(hsl, alpha);
}

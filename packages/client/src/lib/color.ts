export type TRGB = { r: number; g: number; b: number };
export type THSL = { h: number; s: number; l: number };
export type TLCH = { l: number; c: number; h: number };

export const oklchStringToTLCH = (oklch: string): TLCH => {
	const values = oklch.replace('oklch(', '').replace(')', '').split(' ');

	const l = parseFloat(values[0].replace('%', '')) / 100;
	const c = parseFloat(values[1]);
	const h = parseFloat(values[2]);

	return { l, c, h };
};

export const oklchToRGB = (lch: TLCH): TRGB => {
	// Convert Oklch to OKLab
	const { l, c, h } = lch;
	const hRad = (h * Math.PI) / 180;

	// Convert to OKLab
	const L = l;
	const a = c * Math.cos(hRad);
	const b = c * Math.sin(hRad);

	// OKLab to linear RGB
	const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
	const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
	const s_ = L - 0.0894841775 * a - 1.291485548 * b;

	// Inverse nonlinear transform
	const l_r = Math.pow(Math.max(0, l_), 3);
	const m_r = Math.pow(Math.max(0, m_), 3);
	const s_r = Math.pow(Math.max(0, s_), 3);

	// Linear RGB
	const r_linear = +4.0767416621 * l_r - 3.3077115913 * m_r + 0.2309699292 * s_r;
	const g_linear = -1.2684380046 * l_r + 2.6097574011 * m_r - 0.3413193965 * s_r;
	const b_linear = -0.0041960863 * l_r - 0.7034186147 * m_r + 1.707614701 * s_r;

	// Linear to sRGB
	const toSRGB = (x: number) => {
		if (x <= 0) return 0;
		if (x >= 1) return 255;
		return Math.round((x >= 0.0031308 ? 1.055 * Math.pow(x, 1 / 2.4) - 0.055 : 12.92 * x) * 255);
	};

	return {
		r: toSRGB(r_linear),
		g: toSRGB(g_linear),
		b: toSRGB(b_linear)
	};
};

export const rgbToHSL = (rgb: TRGB): THSL => {
	let { r, g, b } = rgb;
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0;
	let s = 0;
	let l = (max + min) / 2;

	if (max === min) {
		h = s = 0; // achromatic
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	return { h: h * 360, s: s * 100, l: l * 100 };
};

export const hslToRGB = (hsl: THSL): TRGB => {
	let { h, s, l } = hsl;
	// Convert to 0-1 range
	h /= 360;
	s /= 100;
	l /= 100;

	let r: number, g: number, b: number;

	if (s === 0) {
		r = g = b = l; // achromatic
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return {
		r: Math.round(r * 255),
		g: Math.round(g * 255),
		b: Math.round(b * 255)
	};
};

export const rgbToRGBA = (rgb: TRGB, alpha: number): string => {
	return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

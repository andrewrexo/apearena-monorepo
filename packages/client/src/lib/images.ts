type Image = {
	sources: {
		avif: string;
		webp: string;
		png: string;
	};
	img: {
		src: string;
		w: number;
		h: number;
	};
};

export const images = import.meta.glob<Image>('$lib/assets/images/*.{webp,png}', {
	query: { enhanced: true },
	import: 'default',
	eager: true
});

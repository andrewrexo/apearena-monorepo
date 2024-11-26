const path = '/src/lib/assets/images';

let games = [
	{
		title: 'Slot Mania 🎰',
		description: 'Spin to win with our animated slot machine!',
		image: `${path}/slots.webp`,
		link: '/slot',
		tag: 'Popular',
		color: 'primary'
	},
	{
		title: 'Crash 🚀',
		description: 'Watch the multiplier rise and cash out before the crash!',
		image: `${path}/crash.webp`,
		link: '/slot',
		tag: 'Hot',
		color: 'secondary'
	},
	{
		title: 'Pixel Poker 🃏',
		description: 'Classic poker with a retro twist.',
		image: `${path}/poker.webp`,
		link: '/slot',
		tag: 'New',
		color: 'accent'
	},
	{
		title: 'Dice Duel 🎲',
		description: 'Fast-paced multiplayer dice battles!',
		image: `${path}/dice.webp`,
		link: '/slot',
		tag: 'Multiplayer',
		color: 'info'
	}
];

export { games };

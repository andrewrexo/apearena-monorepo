export function formatCurrency(value: number) {
	return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function formatPercent(value: number) {
	return value.toLocaleString('en-US', { style: 'percent', maximumFractionDigits: 1 });
}

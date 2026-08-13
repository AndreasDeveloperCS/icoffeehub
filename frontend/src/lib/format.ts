export function formatMoney(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatLabel(value?: string) {
  if (!value) return '';
  return value
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function lowestPrice(variants: { price: number }[]) {
  return variants.reduce((min, v) => (v.price < min ? v.price : min), variants[0]?.price ?? 0);
}

export const TAX_RATE = 0.08;
export const FREE_SHIPPING_THRESHOLD = 200;
export const SHIPPING_FEE = 15;

export interface Totals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function computeTotals(subtotalInput: number): Totals {
  const subtotal = round2(subtotalInput);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = round2(subtotal * TAX_RATE);
  const total = round2(subtotal + shipping + tax);
  return { subtotal, shipping, tax, total };
}

export function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

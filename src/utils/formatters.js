export function formatNumber(value) {
  return new Intl.NumberFormat("pt-PT").format(value);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
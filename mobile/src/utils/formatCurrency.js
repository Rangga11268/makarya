export function formatCurrency(amount) {
  const num = typeof amount === "number" ? amount : parseFloat(amount) || 0;
  return "Rp " + new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(num);
}
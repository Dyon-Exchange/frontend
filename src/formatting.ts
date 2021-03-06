export function toCurrency(num: number): string {
  if (!num) {
    return "";
  }

  return num.toLocaleString("en-us", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: "currency",
    currency: "USD",
  });
}

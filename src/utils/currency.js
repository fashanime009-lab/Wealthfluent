import { currencies } from "../data/currencies";

export function formatCurrency(value, currencyCode = "USD") {
  if (value == null || Number.isNaN(value)) return "";

  const currency =
    currencies.find((c) => c.code === currencyCode) ||
    currencies.find((c) => c.code === "USD");

  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    maximumFractionDigits: 0,
  }).format(value);
}
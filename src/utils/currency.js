import { currencies } from "../data/currencies";

// fractionDigits: decimals to show. Whole units by default; pass 2 where the
// cents matter (a bond's price against its face value, a monthly SIP amount).
export function formatCurrency(value, currencyCode = "USD", compact = false, fractionDigits = 0) {
  if (value == null || Number.isNaN(value)) return "";

  const currency =
    currencies.find((c) => c.code === currencyCode) ||
    currencies.find((c) => c.code === "USD");

  if (compact) {
    return formatCompactCurrency(value, currency);
  }

  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

// Indian Rupee uses Lakh (10^5) / Crore (10^7) grouping rather than the
// Thousand/Million/Billion scale — browsers' built-in Intl compact
// notation doesn't reliably produce this, so it's handled by hand here.
// Every other currency falls back to the standard Intl compact notation
// (e.g. $1.2M, £850K).
function formatCompactCurrency(value, currency) {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);

  if (currency.code === "INR") {
    if (abs >= 1e7) return `${sign}${currency.symbol}${trimZero(abs / 1e7)}Cr`;
    if (abs >= 1e5) return `${sign}${currency.symbol}${trimZero(abs / 1e5)}L`;
    if (abs >= 1e3) return `${sign}${currency.symbol}${trimZero(abs / 1e3)}K`;
    return `${sign}${currency.symbol}${abs.toFixed(0)}`;
  }

  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function trimZero(n) {
  return n.toFixed(2).replace(/\.?0+$/, "");
}

import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";
import { USD_CONVERSION_RATES } from "@/services/calculators/globalWealthPercentile";

// Every CATEGORY_DATA `example` was originally written in INR. Rather than
// a literal currency-symbol swap (which would leave a "₹30L loan" looking
// like a "$30,00,000 loan" — technically a number, but not a realistic
// loan size in dollars), `inr(rupees)` converts the original rupee amount
// through its real USD value into the viewer's selected currency's own
// scale, so a 30-lakh loan becomes a comparably realistic loan in
// whichever currency is selected. `fmt` compact-formats the result (lakh/
// crore for INR, K/M/B for everything else — see utils/currency.js).
// Shared by the /calculators listing and the homepage's calculator
// spotlight, which both render the same CATEGORY_DATA examples.
export default function useExampleCurrency() {
  const { settings } = useSettings();
  const rate = USD_CONVERSION_RATES[settings.currency] ?? 1;
  const inr = (rupees) => Math.round((rupees * USD_CONVERSION_RATES.INR) / rate);
  const fmt = (v) => formatCurrency(v, settings.currency, true);
  return { inr, fmt };
}

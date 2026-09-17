import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";
import { sipFutureValue, emiBreakdown } from "@/utils/projections";
import useTilt from "@/hooks/useTilt";
import GrowthChart from "../GrowthChart";
import { CATEGORY_COLORS } from "@/data/categoryColors";

const SIP_MONTHLY = 5000;
const SIP_YEARS = 15;
const SIP_RATE = 12;

const EMI_PRINCIPAL = 3000000;
const EMI_RATE = 8.5;
const EMI_YEARS = 20;

// Only "loan" carries a category color and its own instrument panel so
// far — the rest pick theirs up in the same pass once this one's
// approved (see design.md).
const REST = [
  { title: "FIRE Calculator", desc: "The number you need to retire early.", route: "/fire-calculator", example: "₹6L/yr expenses → ₹1.5Cr FIRE number" },
  { title: "Net Worth Calculator", desc: "Assets minus liabilities — your real net worth.", route: "/networth-calculator", example: "₹85L assets − ₹22L liabilities → ₹63L" },
  { title: "CAGR Calculator", desc: "The compound annual growth rate between two values.", route: "/cagr-calculator", example: "₹1L → ₹2L in 5 yrs → 14.9% CAGR" },
  { title: "Fixed Deposit Calculator", desc: "Maturity value and interest earned on an FD.", route: "/fd-calculator", example: "₹2L at 7% for 5 yrs → ₹2.83L", category: "loan" },
];

export default function CalculatorsSection() {
  const { settings } = useSettings();
  const fmt = (v) => formatCurrency(v, settings.currency, settings.compactNumbers);
  const { ref: sipRef, style: sipStyle, onPointerMove: onSipMove, onPointerLeave: onSipLeave } = useTilt();
  const { ref: emiRef, style: emiStyle, onPointerMove: onEmiMove, onPointerLeave: onEmiLeave } = useTilt();
  const loan = CATEGORY_COLORS.loan;

  const sipValue = sipFutureValue(SIP_MONTHLY, SIP_YEARS, SIP_RATE);
  const sipSeries = useMemo(() => {
    const points = [];
    for (let y = 0; y <= SIP_YEARS; y++) points.push(sipFutureValue(SIP_MONTHLY, y, SIP_RATE));
    return points;
  }, []);

  const { emi, totalPayment, totalInterest } = emiBreakdown(EMI_PRINCIPAL, EMI_RATE, EMI_YEARS);
  const principalShare = (EMI_PRINCIPAL / totalPayment) * 100;

  return (
    // Full-bleed warm paper room — its own space between the neutral
    // hero/status area above and the dark verdict room below, instead of
    // the whole page sharing one flat background.
    <section className="bg-[#f7f3ec] py-14 dark:bg-[#0b1210]">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-[20px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[22px]">
          20 calculators. Every one shows real math.
        </h2>
        <Link
          to="/calculators"
          className="flex-shrink-0 text-[13.5px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
        >
          See all 20
        </Link>
      </div>

      {/* Spotlights — the same instrument-panel signature as the Hero,
          repeated on purpose so it reads as the site's device, not a
          one-off. Each category gets its own panel color once it's been
          built out (see design.md) — Investment (green) and Loan
          (cobalt) so far. Everything below stays a quiet, dense list. */}
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Link
          to="/sip-calculator"
          ref={sipRef}
          onPointerMove={onSipMove}
          onPointerLeave={onSipLeave}
          style={sipStyle}
          className="block rounded-lg bg-[#0e1512] p-6 sm:p-8"
        >
          <span className="text-[12px] font-semibold text-[#34d399]">Most used calculator</span>
          <h3 className="font-display mt-1.5 text-[20px] font-extrabold text-[#eef1ec] sm:text-[22px]">SIP Calculator</h3>
          <p className="mt-2 max-w-[32ch] text-[13.5px] leading-6 text-[#eef1ec]/55">
            What a recurring monthly investment grows to.
          </p>

          <div className="mt-5 border-t border-[#eef1ec]/10 pt-5">
            <p className="text-[12.5px] text-[#eef1ec]/55">
              {fmt(SIP_MONTHLY)}/mo at {SIP_RATE}% for {SIP_YEARS} years grows to
            </p>
            <p className="font-mono-tech mt-1 text-[30px] font-medium leading-none tabular-nums text-[#34d399] sm:text-[34px]">
              {fmt(Math.round(sipValue))}
            </p>
            <div className="mt-4">
              <GrowthChart series={sipSeries} height={64} />
            </div>
          </div>

          <span className="mt-5 inline-block text-[13.5px] font-semibold text-[#eef1ec] underline decoration-[#eef1ec]/30 underline-offset-4">
            Open calculator
          </span>
        </Link>

        <Link
          to="/emi-calculator"
          ref={emiRef}
          onPointerMove={onEmiMove}
          onPointerLeave={onEmiLeave}
          style={{ ...emiStyle, backgroundColor: loan.panel }}
          className="block rounded-lg p-6 sm:p-8"
        >
          <span className="text-[12px] font-semibold" style={{ color: loan.bright }}>
            {loan.name}
          </span>
          <h3 className="font-display mt-1.5 text-[20px] font-extrabold text-[#eef1ec] sm:text-[22px]">EMI Calculator</h3>
          <p className="mt-2 max-w-[32ch] text-[13.5px] leading-6 text-[#eef1ec]/55">
            Monthly payments for a home, car, or personal loan.
          </p>

          <div className="mt-5 border-t border-[#eef1ec]/10 pt-5">
            <p className="text-[12.5px] text-[#eef1ec]/55">
              {fmt(EMI_PRINCIPAL)} at {EMI_RATE}% for {EMI_YEARS} years, monthly payment
            </p>
            <p className="font-mono-tech mt-1 text-[30px] font-medium leading-none tabular-nums sm:text-[34px]" style={{ color: loan.bright }}>
              {fmt(Math.round(emi))}
            </p>

            <div className="mt-4">
              <div className="flex h-[3px] overflow-hidden rounded-full bg-[#eef1ec]/12">
                <div style={{ width: `${principalShare}%`, backgroundColor: loan.bright }} />
                <div className="flex-1 bg-[#eef1ec]/25" />
              </div>
              <div className="mt-2.5 flex items-baseline justify-between text-[12px] text-[#eef1ec]/55">
                <span>Principal {fmt(EMI_PRINCIPAL)}</span>
                <span>Interest {fmt(Math.round(totalInterest))}</span>
              </div>
            </div>
          </div>

          <span className="mt-5 inline-block text-[13.5px] font-semibold text-[#eef1ec] underline decoration-[#eef1ec]/30 underline-offset-4">
            Open calculator
          </span>
        </Link>
      </div>

      <div className="mt-7 divide-y divide-[#111814]/10 border-b border-t border-[#111814]/10 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/10">
        {REST.map((calc) => {
          const cat = calc.category ? CATEGORY_COLORS[calc.category] : null;
          return (
            <Link
              key={calc.route}
              to={calc.route}
              className="grid grid-cols-1 gap-2 py-5 transition-opacity hover:opacity-70 sm:grid-cols-[1.2fr_1fr] sm:gap-8"
            >
              <div className="min-w-0">
                {cat && (
                  <span
                    className="text-[11.5px] font-semibold"
                    style={{ "--tone-l": cat.light, "--tone-d": cat.bright }}
                  >
                    <span className="tone-text">{cat.name}</span>
                  </span>
                )}
                <h3 className="font-display mt-0.5 text-[16px] font-bold text-[#111814] dark:text-[#eef1ec]">{calc.title}</h3>
                <p className="mt-1 max-w-[42ch] text-[13px] leading-5 text-[#111814]/55 dark:text-[#eef1ec]/55">{calc.desc}</p>
              </div>
              <div className="min-w-0 sm:text-right">
                <p className="font-mono-tech text-[13px] tabular-nums text-[#111814]/70 dark:text-[#eef1ec]/70">{calc.example}</p>
              </div>
            </Link>
          );
        })}
      </div>
      </div>
    </section>
  );
}

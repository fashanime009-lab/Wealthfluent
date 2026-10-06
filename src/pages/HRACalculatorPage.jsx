import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currency";
import { useState } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import AdSlot from "../components/ads/AdSlot";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "How is HRA exemption calculated?", a: "It's the lowest of three figures: the actual HRA you receive, your rent paid minus 10% of basic salary, or 50% of basic salary in a metro city (40% elsewhere) — not simply the rent you pay or the HRA you receive. Whichever of the three is smallest is what you can actually claim." },
  { q: "Which cities count as metro for HRA?", a: "Delhi, Mumbai, Kolkata and Chennai are treated as metro (50% of basic); every other city, including Bengaluru, Hyderabad and Pune, uses the 40% figure, regardless of local rent levels or cost of living." },
  { q: "Do I need rent receipts to claim HRA?", a: "Yes — your employer will usually ask for rent receipts, and for rent above ₹1 lakh a year (about ₹8,333/month) your landlord's PAN is also required. Without this documentation, your employer may not apply the exemption when deducting TDS, even if you're genuinely entitled to it." },
  { q: "Can I claim HRA and a home loan deduction at the same time?", a: "Yes, if you're renting in one city while owning a home (empty, rented out, or occupied by family) elsewhere, or if your own home isn't ready for possession yet. You generally can't claim HRA for rent paid on a home you also live in and claim a home loan deduction for." },
  { q: "What if I pay rent to a parent or relative?", a: "It's allowed, provided it's genuine — a real rental agreement, actual rent transfers (not just a paper trail), and the relative declares the rent as income on their own return. Tax authorities scrutinise these arrangements more closely than rent paid to an unrelated landlord." },
  { q: "Does the new tax regime allow HRA exemption?", a: "No — HRA exemption is only available under the old tax regime. Under the new regime, HRA received is fully taxable as salary, which is one of the specific trade-offs to weigh when comparing the two regimes if you pay significant rent." },
];

export default function HRACalculatorPage() {
  const [basicSalary, setBasicSalary] = useState(40000);
  const [hraReceived, setHraReceived] = useState(20000);
  const [rentPaid, setRentPaid] = useState(18000);
  const [isMetro, setIsMetro] = useState(true);
  const { settings } = useSettings();

  const metroPct = isMetro ? 0.5 : 0.4;
  const optA = hraReceived;
  const optB = Math.max(0, rentPaid - 0.1 * basicSalary);
  const optC = basicSalary * metroPct;
  const exemptHRA = Math.min(optA, optB, optC);
  const taxableHRA = Math.max(0, hraReceived - exemptHRA);

  const fmt = (v) => formatCurrency(v, settings.currency);

  return (
    <>
      <Seo
        title="HRA Calculator India – House Rent Allowance Exemption"
        description="Calculate your Indian tax-exempt HRA from basic salary, HRA received and rent paid, using the actual three-way Income Tax rule. Free, no signup."
        path="/hra-calculator"
        keywords="HRA calculator, house rent allowance calculator, HRA exemption calculator, HRA exemption rules"
        jsonLd={[
        calculatorSchema({
          name: "HRA Calculator",
          description: "Calculate your tax-exempt HRA from basic salary, HRA received and rent paid, using the actual three-way Income Tax rule.",
          path: "/hra-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Tax & salary"
            scope="india"
            title="HRA Calculator"
            description="Work out your tax-exempt HRA under Indian income tax rules — the lowest of three figures, not simply what you receive or pay in rent."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Basic salary (monthly)" value={basicSalary} onChange={setBasicSalary} min={5000} max={500000} step={1000} format={fmt} />
              <CalcField label="HRA received (monthly)" value={hraReceived} onChange={setHraReceived} min={0} max={250000} step={500} format={fmt} />
              <CalcField label="Rent paid (monthly)" value={rentPaid} onChange={setRentPaid} min={0} max={250000} step={500} format={fmt} />
              <div>
                <p className="text-[13px] font-medium text-[#111814]/70 dark:text-[#eef1ec]/70">City type</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[{ label: "Metro (Delhi, Mumbai, Kolkata, Chennai)", val: true }, { label: "Non-metro", val: false }].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      aria-pressed={isMetro === opt.val}
                      onClick={() => setIsMetro(opt.val)}
                      className={`border px-3 py-2 text-[12.5px] font-semibold transition ${
                        isMetro === opt.val
                          ? "border-[#047857] bg-[#047857]/[0.08] text-[#047857] dark:border-[#34d399] dark:bg-[#34d399]/10 dark:text-[#34d399]"
                          : "border-[#111814]/15 text-[#111814]/60 hover:border-[#111814]/40 dark:border-[#eef1ec]/15 dark:text-[#eef1ec]/60 dark:hover:border-[#eef1ec]/40"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="Tax-exempt HRA (monthly)" value={fmt(Math.round(exemptHRA))} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="HRA received" value={fmt(optA)} share={hraReceived > 0 ? (optA / hraReceived) * 100 : 0} />
                <CalcStat label="Rent − 10% of basic" value={fmt(Math.round(optB))} share={hraReceived > 0 ? (optB / hraReceived) * 100 : 0} />
                <CalcStat label={`${Math.round(metroPct * 100)}% of basic`} value={fmt(Math.round(optC))} share={hraReceived > 0 ? (optC / hraReceived) * 100 : 0} />
                <CalcStat label="Taxable HRA" value={fmt(Math.round(taxableHRA))} share={hraReceived > 0 ? (taxableHRA / hraReceived) * 100 : 0} tone="signal" />
              </div>
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                Illustrative only — only available under the old tax regime, and assumes you have valid rent
                receipts. Consult a tax professional for your actual return.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <AdSlot slotId="hra_calc_mid" />

            <CalcSection title="What is an HRA calculator?">
              <p>
                House Rent Allowance is the part of a salaried employee's CTC paid specifically toward rent, and
                part of it can be exempt from income tax under the old tax regime. An HRA calculator works out
                exactly how much of your HRA is exempt — which, despite what many people assume, isn't simply
                "whatever HRA you receive" or "whatever rent you pay."
              </p>
              <p>
                The exemption is deliberately the smallest of three figures, which means a generous HRA component
                in your salary doesn't guarantee a large exemption if your actual rent or basic salary don't
                support it.
              </p>
            </CalcSection>

            <CalcSection title="How is HRA exemption calculated?">
              <p>The exempt amount is the lowest of three figures:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                Exempt HRA = min(HRA received, Rent paid − 10% of basic, 50% or 40% of basic)
              </p>
              <p>
                For example, a ₹40,000 monthly basic salary with ₹20,000 HRA received and ₹18,000 rent paid, in a
                metro city: HRA received is ₹20,000; rent minus 10% of basic is ₹18,000 − ₹4,000 = ₹14,000; and 50%
                of basic is ₹20,000. The lowest of the three is ₹14,000 — not the full ₹20,000 HRA received, even
                though it might look that way at first glance. The remaining ₹6,000 of HRA is taxed as regular
                salary.
              </p>
            </CalcSection>

            <CalcSection title="Benefits of claiming HRA correctly">
              <CalcBenefitGrid
                items={[
                  { title: "Lower taxable income", text: "A correctly claimed exemption directly reduces the salary income you're taxed on, under the old regime." },
                  { title: "Clarity for regime choice", text: "Knowing your real HRA exemption is one of the inputs that decides whether the old or new tax regime actually saves you more." },
                  { title: "Avoids under- or over-claiming", text: "Claiming the full HRA received when a lower figure applies risks a mismatch at assessment; claiming too little leaves a real deduction unused." },
                  { title: "Useful for salary negotiation", text: "Understanding how the HRA component is actually taxed helps evaluate whether a higher HRA or a higher basic salary serves you better." },
                ]}
              />
            </CalcSection>

            <RelatedLinks />

            <VerdictFAQ items={FAQ_ITEMS} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
          </div>
        </div>
      </div>
    </>
  );
}

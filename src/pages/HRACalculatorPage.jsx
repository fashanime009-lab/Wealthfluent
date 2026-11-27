import { formatCurrency } from "../utils/currency";
import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema, howToSchema } from "@/components/seo/schema";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import CalcTable from "@/components/calculators/CalcTable";
import { calcLinkClass, calcStrongClass } from "@/components/calculators/calcStyles";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

function buildFaqItems(fmt) {
  return [
    { q: "How is HRA exemption calculated?", a: "It's the lowest of three figures: the actual HRA you receive, your rent paid minus 10% of basic salary, or 50% of basic salary in a metro city (40% elsewhere) — not simply the rent you pay or the HRA you receive. Whichever of the three is smallest is what you can actually claim." },
    { q: "Which cities count as metro for HRA?", a: "From FY 2026-27, Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune and Ahmedabad are all treated as metro (50% of basic) — the list was expanded from the original four cities under the new Income Tax Act. Every other city uses the 40% figure, regardless of local rent levels or cost of living. Confirm which year's rules apply to your filing, since earlier years used only the original four-city list." },
    { q: "Do I need rent receipts to claim HRA?", a: `Yes — your employer will usually ask for rent receipts, and for rent above ${fmt(100000)} a year (about ${fmt(8333)}/month) your landlord's PAN is also required. Without this documentation, your employer may not apply the exemption when deducting TDS, even if you're genuinely entitled to it.` },
    { q: "Can I claim HRA and a home loan deduction at the same time?", a: "Yes, if you're renting in one city while owning a home (empty, rented out, or occupied by family) elsewhere, or if your own home isn't ready for possession yet. You generally can't claim HRA for rent paid on a home you also live in and claim a home loan deduction for." },
    { q: "What if I pay rent to a parent or relative?", a: "It's allowed, provided it's genuine — a real rental agreement, actual rent transfers (not just a paper trail), and the relative declares the rent as income on their own return. Tax authorities scrutinise these arrangements more closely than rent paid to an unrelated landlord." },
    { q: "Does the new tax regime allow HRA exemption?", a: "No — HRA exemption is only available under the old tax regime. Under the new regime, HRA received is fully taxable as salary, which is one of the specific trade-offs to weigh when comparing the two regimes if you pay significant rent." },
    { q: "My salary has no HRA. Can I still save tax on rent?", a: "Under the old tax regime, if you don't receive HRA and don't own a home where you live, you can claim a deduction for rent paid (Section 80GG under the old Act). It's the lowest of ₹5,000 a month, 25% of your total income, or rent paid minus 10% of total income, and you file a declaration with your return." },
  ];
}

export default function HRACalculatorPage() {
  const [basicSalary, setBasicSalary] = useState(40000);
  const [hraReceived, setHraReceived] = useState(20000);
  const [rentPaid, setRentPaid] = useState(18000);
  const [isMetro, setIsMetro] = useState(true);

  const metroPct = isMetro ? 0.5 : 0.4;
  const optA = hraReceived;
  const optB = Math.max(0, rentPaid - 0.1 * basicSalary);
  const optC = basicSalary * metroPct;
  const exemptHRA = Math.min(optA, optB, optC);
  const taxableHRA = Math.max(0, hraReceived - exemptHRA);

  // HRA exemption is a specific Indian Income Tax Act calculation (metro
  // city percentages, the ₹1L/year PAN threshold, etc.) — always displays
  // INR regardless of the global currency setting.
  const fmt = (v) => formatCurrency(v, "INR");
  const FAQ_ITEMS = buildFaqItems(fmt);

  const exampleBasic = 40000;
  const exampleHra = 20000;
  const exampleRent = 18000;
  const exampleOptB = Math.max(0, exampleRent - 0.1 * exampleBasic);
  const exampleOptC = exampleBasic * 0.5;
  const exampleExempt = Math.min(exampleHra, exampleOptB, exampleOptC);

  // Exemption at different rents, from the salary entered above.
  const exemptAt = (rent) => Math.min(hraReceived, Math.max(0, rent - 0.1 * basicSalary), basicSalary * metroPct);
  const rentRows = [0.2, 0.4, 0.6, 0.8].map((k) => {
    const rent = Math.round((basicSalary * k) / 1000) * 1000;
    const exempt = exemptAt(rent);
    return [`${fmt(rent)} a month`, fmt(Math.round(exempt)), fmt(Math.round(hraReceived - exempt)), fmt(Math.round(exempt * 12))];
  });
  // Tax saved a year on the exemption, by slab, including 4% cess.
  const yearlyExempt = exemptHRA * 12;
  const slabRows = [5, 20, 30].map((slab) => [`${slab}% slab`, fmt(Math.round(yearlyExempt * (slab / 100) * 1.04))]);

  return (
    <>
      <Seo
        title="HRA Calculator: House Rent Allowance Exemption"
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
        howToSchema({
          name: "How to Use the HRA Calculator",
          description: "Calculate your tax-exempt House Rent Allowance under the Indian Income Tax Act's three-way rule.",
          steps: [
            { name: "Enter your basic salary", text: "Enter your monthly basic salary in the Basic salary field." },
            { name: "Enter your HRA received", text: "Enter the monthly HRA you receive from your employer in the HRA received field." },
            { name: "Enter your rent paid", text: "Enter how much monthly rent you actually pay in the Rent paid field." },
            { name: "Select your city type", text: "Choose Metro or Non-metro for the city you live in, under City type." },
            { name: "View your result instantly", text: "The calculator instantly shows your tax-exempt HRA and the taxable portion." },
          ],
        }),
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
                  {[{ label: "Metro (Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune, Ahmedabad)", val: true }, { label: "Non-metro", val: false }].map((opt) => (
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
                <CalcStat label="Tax-exempt HRA per year" value={fmt(Math.round(exemptHRA * 12))} />
              </div>
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                Illustrative only — only available under the old tax regime, and assumes you have valid rent
                receipts. Consult a tax professional for your actual return.
              </p>
            </div>
          </div>

          <div className="mt-16">

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
                For example, a {fmt(exampleBasic)} monthly basic salary with {fmt(exampleHra)} HRA received and {fmt(exampleRent)} rent paid, in a
                metro city: HRA received is {fmt(exampleHra)}; rent minus 10% of basic is {fmt(exampleRent)} − {fmt(exampleBasic * 0.1)} = {fmt(exampleOptB)}; and 50%
                of basic is {fmt(exampleOptC)}. The lowest of the three is {fmt(exampleExempt)} — not the full {fmt(exampleHra)} HRA received, even
                though it might look that way at first glance. The remaining {fmt(exampleHra - exampleExempt)} of HRA is taxed as regular
                salary.
              </p>
            </CalcSection>

            <CalcSection title="How rent changes your exemption">
              <p>
                With a {fmt(basicSalary)} basic salary and {fmt(hraReceived)} HRA in a{" "}
                {isMetro ? "metro" : "non-metro"} city, here's how much is exempt at different rents:
              </p>
              <CalcTable
                caption="Monthly figures, plus the yearly exemption"
                columns={["Rent paid", "Exempt HRA", "Taxable HRA", "Exempt per year"]}
                rows={rentRows}
              />
              <p>
                At low rents, "rent minus 10% of basic" is the smallest figure, so paying more rent raises the
                exemption. Once rent is high enough, the exemption hits the cap set by your HRA or by 50% (or 40%)
                of basic, and paying more rent no longer helps.
              </p>
            </CalcSection>

            <CalcSection title="How much tax does it save?">
              <p>
                Your exemption of {fmt(Math.round(yearlyExempt))} a year saves tax at your slab rate, plus 4% cess, under
                the old regime:
              </p>
              <CalcTable caption="Yearly tax saved on your HRA exemption" columns={["Your tax slab", "Tax saved"]} rows={slabRows} />
              <p>
                Compare that saving with what the new regime's lower rates would save you before choosing a regime.
                Our lesson on{" "}
                <Link to="/learn/salary-structuring-and-tax" className={calcLinkClass}>
                  salary structuring and tax
                </Link>{" "}
                explains how to weigh the two.
              </p>
            </CalcSection>

            <CalcSection title="Claiming HRA: what you need">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className={calcStrongClass}>Rent receipts or a rental agreement</strong> for the period you're
                  claiming, given to your employer before the year's tax is finalised.
                </li>
                <li>
                  <strong className={calcStrongClass}>Your landlord's PAN</strong> if your rent is above ₹1 lakh a year.
                </li>
                <li>
                  <strong className={calcStrongClass}>Rent actually paid</strong>, ideally by bank transfer, so there's a
                  record. Rent paid to a parent is allowed if it's genuine and they declare it as income.
                </li>
              </ul>
              <p>
                If you missed giving proof to your employer, you can still claim the exemption when you file your
                return, as long as you have the documents. No HRA in your salary? See the FAQ below on claiming rent
                without it. For another part of your salary, the{" "}
                <Link to="/gratuity-calculator" className={calcLinkClass}>
                  Gratuity Calculator
                </Link>{" "}
                estimates what you'll receive when you leave a job.
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

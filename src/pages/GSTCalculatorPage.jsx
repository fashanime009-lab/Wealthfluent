import { useState } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema, howToSchema } from "@/components/seo/schema";
import { formatCurrency } from "../utils/currency";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import CalcTable from "@/components/calculators/CalcTable";
import { calcStrongClass } from "@/components/calculators/calcStyles";
import RelatedLinks from "@/components/calculators/RelatedLinks";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "What are the GST rates in India?", a: "Since the September 2025 GST reform, the main slabs are 0%, 5%, 18% and 40%. The old 12% and 28% slabs are gone: most goods moved down to 5% or 18%, and from 1 February 2026 tobacco products and pan masala moved from 28% to 40%. A few special rates remain, such as 3% on gold, silver and jewellery and 0.25% on rough diamonds." },
  { q: "How is GST calculated?", a: "Multiply the price before tax by the GST rate and divide by 100 to get the GST amount, then add it to the price. At 18%, a ₹1,000 item carries ₹180 of GST, for a total of ₹1,180." },
  { q: "Can this calculator be used for all GST types?", a: "Yes. It applies the full GST rate, which is the same whether the sale is within a state (split equally into CGST and SGST) or between states (charged as IGST). For the CGST and SGST amounts, halve the GST figure." },
  { q: "How do I remove GST from a total price?", a: "Divide the GST-inclusive total by (1 + GST rate/100) to get the base amount, then subtract that from the total to find the GST portion — the reverse of adding GST to a base amount. Choose Remove GST above to do it automatically." },
  { q: "Is GST the same across all of India?", a: "Yes. GST rates are set nationally by the GST Council, so the same item carries the same total rate in every state. Within a state, the tax is split equally between the centre (CGST) and the state (SGST); on sales between states, the whole amount is charged as IGST." },
  { q: "Does the MRP include GST?", a: "Yes. In India the maximum retail price printed on packaged goods includes all taxes, so the shop can't add GST on top. To see how much of an MRP is GST, use Remove GST with the item's rate." },
];

export default function GSTCalculatorPage() {
  const [amount, setAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);
  // "add": the amount is the pre-tax base. "remove": the amount is a GST-
  // inclusive total and the base is worked back out of it. The page title,
  // meta description, search-index entry and sitemap all promise "Add or
  // Remove GST", but only adding was ever implemented.
  const [mode, setMode] = useState("add");

  const rateFactor = 1 + gstRate / 100;
  const baseAmount = mode === "add" ? amount : amount / rateFactor;
  const totalAmount = mode === "add" ? amount * rateFactor : amount;
  const gstAmount = totalAmount - baseAmount;

  // GST is India's own tax system — a GST amount paid in another currency
  // isn't a real-world scenario, so this always displays INR regardless of
  // the global currency setting.
  const fmt = (value) => formatCurrency(value, "INR");

  const slabRows = [
    ["0%", "Fresh fruit, vegetables and milk; individual life and health insurance premiums"],
    ["5%", "Many packaged foods and daily-use items, such as soap, toothpaste and shampoo"],
    ["18%", "Most other goods and services, including TVs, air conditioners, small cars and professional services"],
    ["40%", "Tobacco and pan masala, sugar-sweetened and aerated drinks, large cars and other luxury items"],
    ["3% / 0.25%", "Special rates: gold, silver and jewellery (3%); rough diamonds (0.25%)"],
  ];
  const quickRates = [5, 18, 40];
  const quickRows = [1000, 10000, 100000].map((base) => [
    fmt(base),
    ...quickRates.map((rate) => `${fmt((base * rate) / 100)} → ${fmt(base * (1 + rate / 100))}`),
  ]);
  const splitBase = 10000;

  return (
    <>
      <Seo
        title="GST Calculator India – Add or Remove GST"
        description="Add or remove GST from any amount instantly — see the tax breakdown and final invoice value for India's GST slabs (0%, 5%, 18%, 40%)."
        path="/gst-calculator"
        keywords="GST calculator, goods and services tax, GST calculation, tax calculator"
        jsonLd={[
        calculatorSchema({
          name: "GST Calculator India",
          description: "Add or remove GST from any amount instantly — see the tax breakdown and final invoice value for India's GST slabs (0%, 5%, 18%, 40%).",
          path: "/gst-calculator",
        }),
        faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        howToSchema({
          name: "How to Use the GST Calculator",
          description: "Add or remove GST from any amount instantly and see the tax breakdown for India's GST slabs.",
          steps: [
            { name: "Choose add or remove GST", text: "Select whether you want to add GST to an amount or remove it from a GST-inclusive total." },
            { name: "Enter the amount", text: "Enter the base amount (before GST) or the total amount (GST included), depending on your chosen mode." },
            { name: "Enter the GST rate", text: "Enter the applicable GST rate as a percentage in the GST rate field." },
            { name: "View your result instantly", text: "The calculator instantly shows the GST amount, base amount and total amount." },
          ],
        }),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Tax & salary"
            scope="india"
            title="GST Calculator"
            description="Calculate GST amount, tax-inclusive pricing, and invoice totals instantly for businesses and consumers in India."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <div>
                <p className="text-[13px] font-medium text-[#111814]/70 dark:text-[#eef1ec]/70">What do you want to do?</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { key: "add", label: "Add GST" },
                    { key: "remove", label: "Remove GST" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      aria-pressed={mode === opt.key}
                      onClick={() => setMode(opt.key)}
                      className={`border px-3 py-2 text-[13px] font-semibold transition ${
                        mode === opt.key
                          ? "border-[#047857] bg-[#047857]/[0.08] text-[#047857] dark:border-[#34d399] dark:bg-[#34d399]/10 dark:text-[#34d399]"
                          : "border-[#111814]/15 text-[#111814]/60 hover:border-[#111814]/40 dark:border-[#eef1ec]/15 dark:text-[#eef1ec]/60 dark:hover:border-[#eef1ec]/40"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <CalcField
                label={mode === "add" ? "Base amount (before GST)" : "Total amount (GST included)"}
                value={amount}
                onChange={setAmount}
                min={100}
                max={100000}
                step={100}
                format={fmt}
              />
              <CalcField label="GST rate (%)" value={gstRate} onChange={setGstRate} min={0} max={40} step={1} suffix="%" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="GST amount" value={fmt(gstAmount)} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Base amount (before GST)" value={fmt(baseAmount)} share={totalAmount > 0 ? (baseAmount / totalAmount) * 100 : 0} />
                <CalcStat label={`GST @ ${gstRate}%`} value={`+ ${fmt(gstAmount)}`} share={totalAmount > 0 ? (gstAmount / totalAmount) * 100 : 0} tone="signal" />
                <CalcStat label="Total amount (including GST)" value={fmt(totalAmount)} share={100} />
              </div>
              <p className="text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
                This calculator is for illustrative purposes only. GST rates and classifications may vary based on
                goods/services and government notifications. Please consult a tax professional for accurate tax
                compliance.
              </p>
            </div>
          </div>

          <div className="mt-16">

            <CalcSection title="What Is GST Calculator?">
              <p>
                A GST Calculator helps businesses and consumers calculate Goods and Services Tax (GST) quickly for
                invoices, product pricing, and tax estimation in India. It supports common GST slabs and provides
                instant tax-inclusive totals.
              </p>
              <p>
                GST replaced most of India's earlier indirect taxes (VAT, service tax, excise duty) with a single,
                unified tax applied at each stage of the supply chain. Depending on whether a transaction happens
                within a state or across states, GST is split into CGST + SGST (intra-state) or IGST (inter-state) —
                the combined rate a buyer pays is the same either way, only how it's divided between central and
                state governments differs.
              </p>
            </CalcSection>

            <CalcSection title="How Is GST Calculated?">
              <p>For adding GST to a base amount:</p>
              <p className="font-mono-tech border border-[#111814]/12 px-4 py-3 text-[13px] tabular-nums text-[#111814] dark:border-[#eef1ec]/12 dark:text-[#eef1ec]">
                GST Amount = (Base Amount × GST Rate) / 100 &nbsp;|&nbsp; Total = Base Amount + GST Amount
              </p>
              <p>
                For example, a {fmt(1000)} base amount at 18% GST adds {fmt(180)}, for a total of {fmt(1180)}. If you instead have a
                GST-inclusive price and need to find the base amount, divide by (1 + rate/100): a {fmt(1180)} inclusive
                price at 18% GST works back to a {fmt(1000)} base — the reverse of the forward calculation above.
              </p>
            </CalcSection>

            <CalcSection title="GST slabs at a glance">
              <p>
                The September 2025 reform cut India's main GST slabs to four. These are broad examples; the exact
                rate depends on how an item is classified, so check the official rate schedule for business
                invoices.
              </p>
              <CalcTable caption="Main GST rates in India" columns={["Rate", "Examples"]} rows={slabRows} />
            </CalcSection>

            <CalcSection title="CGST, SGST and IGST">
              <p>
                The rate a buyer pays doesn't change with where they are; only who collects it does. On a{" "}
                {fmt(splitBase)} sale at 18%:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong className={calcStrongClass}>Within one state:</strong> {fmt(splitBase * 0.09)} CGST to the centre
                  plus {fmt(splitBase * 0.09)} SGST to the state, {fmt(splitBase * 0.18)} in total.
                </li>
                <li>
                  <strong className={calcStrongClass}>Between states:</strong> {fmt(splitBase * 0.18)} IGST, collected by the
                  centre and shared with the state where the goods are used.
                </li>
              </ul>
              <p>Either way the buyer pays {fmt(splitBase * 1.18)}.</p>
            </CalcSection>

            <CalcSection title="Quick reference: GST on common amounts">
              <CalcTable
                caption="GST amount → total price, by base amount and rate"
                columns={["Base amount", ...quickRates.map((rate) => `At ${rate}%`)]}
                rows={quickRows}
              />
            </CalcSection>

            <CalcSection title="Input tax credit, briefly">
              <p>
                GST is charged at every stage of the supply chain, but registered businesses can usually deduct the
                GST they paid on their purchases (input tax credit) from the GST they collect on their sales, and
                pay only the difference. That's why GST ends up being paid, in effect, by the final consumer. As a
                consumer you can't claim it back; as a business, keep valid tax invoices for every purchase so you
                can.
              </p>
            </CalcSection>

            <CalcSection title="Benefits Of GST Calculator">
              <CalcBenefitGrid
                items={[
                  { title: "Faster Invoice Calculation", text: "Quickly estimate GST-inclusive invoice totals without manual tax calculations." },
                  { title: "Better Tax Planning", text: "Businesses can estimate tax obligations and product pricing more accurately." },
                  { title: "Transparent Pricing", text: "Consumers can understand how much tax they are paying on purchases." },
                  { title: "Error-Free Calculations", text: "Avoid manual errors in tax computation and ensure accurate billing." },
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

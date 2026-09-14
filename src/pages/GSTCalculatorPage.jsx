import { useState } from "react";
import Seo from "@/components/seo/Seo";
import { calculatorSchema, faqSchema } from "@/components/seo/schema";
import AdSlot from "../components/ads/AdSlot";
import CalcHeader from "@/components/calculators/CalcHeader";
import CalcField from "@/components/calculators/CalcField";
import CalcResultPanel from "@/components/calculators/CalcResultPanel";
import CalcStat from "@/components/calculators/CalcStat";
import CalcSection from "@/components/calculators/CalcSection";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const FAQ_ITEMS = [
  { q: "What are common GST rates in India?", a: "Common GST slabs include 5%, 12%, 18%, and 28% depending on product and service category. Some essential goods are taxed at 0% or 5%." },
  { q: "How is GST calculated?", a: "GST is calculated by multiplying the taxable amount by the applicable GST percentage. The total amount is the sum of the base amount and the GST amount." },
  { q: "Can this calculator be used for all GST types?", a: "This calculator works for both CGST+SGST (intra-state) and IGST (inter-state) by applying the combined rate. For detailed bifurcation, consult a tax advisor." },
  { q: "How do I remove GST from a total price?", a: "Divide the GST-inclusive total by (1 + GST rate/100) to get the base amount, then subtract that from the total to find the GST portion — the reverse of adding GST to a base amount." },
  { q: "Is GST the same across all of India?", a: "The rate slabs (5%, 12%, 18%, 28%) are set nationally and apply uniformly across states — what changes state to state is only the CGST/SGST split, never the total rate a buyer pays." },
];

export default function GSTCalculatorPage() {
  const [amount, setAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);

  const gstAmount = (amount * gstRate) / 100;
  const totalAmount = amount + gstAmount;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value);
  };
  const fmt = (value) => `₹${formatCurrency(value)}`;

  return (
    <>
      <Seo
        title="GST Calculator India – Add or Remove GST"
        description="Add or remove GST from any amount instantly — see the tax breakdown and final invoice value for India's GST slabs (5%, 12%, 18%, 28%)."
        path="/gst-calculator"
        keywords="GST calculator, goods and services tax, GST calculation, tax calculator"
        jsonLd={[
        calculatorSchema({
          name: "GST Calculator India",
          description: "Add or remove GST from any amount instantly — see the tax breakdown and final invoice value for India's GST slabs (5%, 12%, 18%, 28%).",
          path: "/gst-calculator",
        }),
        faqSchema([
          {
            "question": "What are common GST rates in India?",
            "answer": "Common GST slabs include 5%, 12%, 18%, and 28% depending on product and service category. Some essential goods are taxed at 0% or 5%."
          },
          {
            "question": "How is GST calculated?",
            "answer": "GST is calculated by multiplying the taxable amount by the applicable GST percentage. The total amount is the sum of the base amount and the GST amount."
          },
          {
            "question": "Can this calculator be used for all GST types?",
            "answer": "This calculator works for both CGST+SGST (intra-state) and IGST (inter-state) by applying the combined rate. For detailed bifurcation, consult a tax advisor."
          },
          {
            "question": "How do I remove GST from a total price?",
            "answer": "Divide the GST-inclusive total by (1 + GST rate/100) to get the base amount, then subtract that from the total to find the GST portion — the reverse of adding GST to a base amount."
          },
          {
            "question": "Is GST the same across all of India?",
            "answer": "The rate slabs (5%, 12%, 18%, 28%) are set nationally and apply uniformly across states — what changes state to state is only the CGST/SGST split, never the total rate a buyer pays."
          }
        ]),
      ]}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-12">
          <CalcHeader
            category="Loan & interest"
            title="GST Calculator"
            description="Calculate GST amount, tax-inclusive pricing, and invoice totals instantly for businesses and consumers in India."
          />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-7 border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
              <CalcField label="Base amount" value={amount} onChange={setAmount} min={100} max={100000} step={100} format={fmt} />
              <CalcField label="GST rate (%)" value={gstRate} onChange={setGstRate} min={1} max={28} step={1} suffix="%" />
            </div>

            <div className="space-y-6">
              <CalcResultPanel label="GST amount" value={fmt(gstAmount)} />
              <div className="divide-y divide-[#111814]/10 border border-[#111814]/12 bg-[#ffffff] px-6 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <CalcStat label="Base amount" value={fmt(amount)} share={(amount / totalAmount) * 100} />
                <CalcStat label={`GST @ ${gstRate}%`} value={`+ ${fmt(gstAmount)}`} share={(gstAmount / totalAmount) * 100} tone="signal" />
                <CalcStat label="Total amount (including GST)" value={fmt(totalAmount)} share={100} />
              </div>
              <p className="text-[12px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
                This calculator is for illustrative purposes only. GST rates and classifications may vary based on
                goods/services and government notifications. Please consult a tax professional for accurate tax
                compliance.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <AdSlot slotId="gst_calc_mid" />

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
                For example, a ₹1,000 base amount at 18% GST adds ₹180, for a total of ₹1,180. If you instead have a
                GST-inclusive price and need to find the base amount, divide by (1 + rate/100): a ₹1,180 inclusive
                price at 18% GST works back to a ₹1,000 base — the reverse of the forward calculation above.
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

            <VerdictFAQ items={FAQ_ITEMS} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
          </div>
        </div>
      </div>
    </>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFinancialProfile, saveFinancialProfile } from "@/engine/financialProfile";
import Seo from "@/components/seo/Seo";

const FIELDS = [
  { key: "monthlyIncome", label: "Monthly income (take-home)", placeholder: "80000" },
  { key: "monthlyExpenses", label: "Monthly expenses", placeholder: "50000" },
  { key: "totalAssets", label: "Total assets (savings, investments, property)", placeholder: "1500000" },
  { key: "totalLiabilities", label: "Total liabilities (loans, credit card debt)", placeholder: "500000" },
  { key: "emergencyFundAmount", label: "Emergency fund set aside", placeholder: "150000" },
];

export default function FinancialProfilePage() {
  const navigate = useNavigate();
  const existing = getFinancialProfile();
  const [values, setValues] = useState(
    Object.fromEntries(FIELDS.map((f) => [f.key, existing?.[f.key] ?? ""]))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    saveFinancialProfile(
      Object.fromEntries(FIELDS.map((f) => [f.key, Number(values[f.key]) || 0]))
    );
    navigate("/");
  };

  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
      <div className="mx-auto max-w-lg px-5 py-16 sm:px-8">
        <Seo
          title="Financial Profile"
          description="Enter your real numbers to see your genuine overall financial status."
          path="/financial-profile"
          noindex
        />

        <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Financial profile</span>
        <h1 className="font-display mt-3 text-3xl font-extrabold text-[#111814] dark:text-[#eef1ec]">
          {existing ? "Update your financial profile" : "Set up your financial profile"}
        </h1>
        <p className="mt-2 text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
          Five real numbers, nothing more. This is what powers your actual overall financial status — kept only in
          your browser, never sent anywhere.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {FIELDS.map((field) => (
            <div key={field.key}>
              <label className="text-[13px] font-medium text-[#111814]/70 dark:text-[#eef1ec]/70">{field.label}</label>
              <input
                type="number"
                min="0"
                required
                value={values[field.key]}
                onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
                className="mt-1.5 w-full border border-[#111814]/15 bg-transparent px-4 py-3.5 font-mono-tech text-[15px] tabular-nums text-[#111814] outline-none focus:border-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:focus:border-[#34d399]"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-[#047857] py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#065f46]"
          >
            {existing ? "Update Status" : "See My Status"}
          </button>
        </form>
      </div>
    </div>
  );
}

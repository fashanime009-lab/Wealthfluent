import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";
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
    <div className="mx-auto max-w-lg px-5 py-14 sm:px-8">
      <Seo
        title="Financial Profile"
        description="Enter your real numbers to see your genuine overall financial status."
        path="/financial-profile"
        noindex
      />

      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50">
        <Wallet className="text-emerald-700" size={26} />
      </div>
      <h1 className="mt-5 text-3xl font-black text-slate-950">
        {existing ? "Update your financial profile" : "Set up your financial profile"}
      </h1>
      <p className="mt-2 text-slate-500">
        Five real numbers, nothing more. This is what powers your actual overall financial status — kept only in
        your browser, never sent anywhere.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="text-[13px] font-bold text-slate-600">{field.label}</label>
            <input
              type="number"
              min="0"
              required
              value={values[field.key]}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              placeholder={field.placeholder}
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3.5 text-[15px] outline-none focus:border-emerald-500"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-800 py-4 text-[14px] font-black text-white transition hover:bg-emerald-900"
        >
          {existing ? "Update Status" : "See My Status"}
        </button>
      </form>
    </div>
  );
}

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";


import SectionTitle from "../SectionTitle";
import CalculatorGrid from "./CalculatorGrid";

export default function CalculatorsSection() {
  return (
    <section className="relative z-20 mx-auto -mt-8 max-w-[1660px] rounded-[28px] bg-white/92 px-5 py-7 shadow-[0_24px_70px_rgba(15,23,42,.07)] ring-1 ring-slate-200/80 backdrop-blur-xl sm:px-8 lg:px-12">
      <SectionTitle
        title="Powerful tools for every financial decision"
        text="Professional-grade calculators and planners to help you decide better."
        action={<Link to="/calculators" className="flex items-center gap-3 text-[14px] font-black text-emerald-800">View All Calculators <ArrowRight size={18} /></Link>}
      />
      <div className="mt-8">
  <CalculatorGrid />
</div>
    </section>
  );
}

import { proofItems } from "../../data/homepage";


export default function ProofStrip() {
  return (
    <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-4">
      {proofItems.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="flex items-start gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
              <Icon size={15} />
            </span>
            <span>
              <span className="block text-[11px] font-black text-slate-950">{item.title}</span>
              <span className="mt-0.5 block text-[10px] leading-snug text-slate-500">{item.text}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
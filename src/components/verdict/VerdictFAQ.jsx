import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function VerdictFAQ({ items, className = "" }) {
  const [open, setOpen] = useState(0);

  return (
    <div className={className}>
      <h2 className="font-serif text-2xl font-bold">Common questions</h2>
      <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
        {items.map((item, i) => (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <span className="text-[14px] font-bold text-slate-950">{item.q}</span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-slate-400 transition-transform ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && (
              <p className="pb-5 text-[13px] leading-6 text-slate-600">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

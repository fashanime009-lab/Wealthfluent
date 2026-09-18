import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function VerdictFAQ({ items, className = "" }) {
  const [open, setOpen] = useState(0);

  return (
    <div className={className}>
      <h2 className="font-display text-[22px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec]">
        Common questions
      </h2>
      <div className="mt-5 divide-y divide-[#111814]/10 border-y border-[#111814]/10 dark:divide-[#eef1ec]/10 dark:border-[#eef1ec]/10">
        {items.map((item, i) => (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="text-[14px] font-semibold text-[#111814] dark:text-[#eef1ec]">{item.q}</span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-[#111814]/40 transition-transform dark:text-[#eef1ec]/40 ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {/* Always rendered, never conditionally mounted — every page
                that uses this component also ships FAQPage JSON-LD (see
                faqSchema in seo/schema.js) built from these same items.
                Conditionally mounting only the open answer meant every
                answer except the first was completely absent from the
                page's HTML — present in the structured data but nowhere
                in the actual content, which is exactly the kind of
                schema/content mismatch that gets FAQ rich results
                rejected. Hiding via CSS instead keeps every answer in the
                DOM (and in the prerendered snapshot) while the closed
                ones stay visually collapsed for real visitors. */}
            <p
              className={`pb-5 text-[13px] leading-6 text-[#111814]/65 dark:text-[#eef1ec]/65 ${open === i ? "" : "hidden"}`}
            >
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

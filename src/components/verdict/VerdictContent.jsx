import { Link } from "react-router-dom";
import CalcSection from "@/components/calculators/CalcSection";
import CalcBenefitGrid from "@/components/calculators/CalcBenefitGrid";
import VerdictFAQ from "./VerdictFAQ";

/**
 * The written half of a verdict page — method, what the default numbers
 * say, what flips the answer, what the tool leaves out, related reading and
 * FAQs — rendered from one content object so the visible FAQ and the
 * FAQPage JSON-LD on each page are built from the exact same items.
 *
 * content.sections: [{ title, paragraphs?, steps?, bullets?, grid? }]
 * content.related:  [{ label, to, note }]
 * content.faqs:     [{ q, a }]
 */
export default function VerdictContent({ content, className = "mt-16 max-w-2xl space-y-12" }) {
  return (
    <div className={className}>
      {content.sections.map((section) => (
        <CalcSection key={section.title} title={section.title}>
          {section.paragraphs?.map((text) => (
            <p key={text}>{text}</p>
          ))}
          {section.steps && (
            <ol className="list-decimal space-y-2 pl-5">
              {section.steps.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ol>
          )}
          {section.bullets && (
            <ul className="list-disc space-y-2 pl-5">
              {section.bullets.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          )}
          {section.grid && <CalcBenefitGrid items={section.grid} />}
          {section.after?.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </CalcSection>
      ))}

      {content.related?.length > 0 && (
        <CalcSection title="Keep going">
          <ul className="space-y-3">
            {content.related.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
                >
                  {item.label}
                </Link>
                {item.note && <span className="text-[#111814]/60 dark:text-[#eef1ec]/55"> — {item.note}</span>}
              </li>
            ))}
          </ul>
        </CalcSection>
      )}

      <VerdictFAQ items={content.faqs} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
    </div>
  );
}

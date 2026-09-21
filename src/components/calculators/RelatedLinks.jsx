import { Link, useLocation } from "react-router-dom";
import CalcSection from "./CalcSection";
import { getCalculatorRelated } from "@/data/recommendations/calculatorRecommendations";

/**
 * The "Related" block at the end of a calculator page. It reads the current
 * route and looks it up in src/data/recommendations/calculatorRecommendations.js,
 * so a page just renders <RelatedLinks /> — the links themselves live in data.
 * Renders nothing when the route has no entry.
 */
export default function RelatedLinks() {
  const { pathname } = useLocation();
  const items = getCalculatorRelated(pathname);

  if (items.length === 0) return null;

  return (
    <CalcSection title="Related">
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.to} className="grid gap-1">
            <span className="text-[12.5px] font-semibold text-[#047857] dark:text-[#34d399]">{item.kind}</span>
            <span>
              <Link
                to={item.to}
                className="font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
              >
                {item.label}
              </Link>
              {item.note && <span className="text-[#111814]/60 dark:text-[#eef1ec]/55"> — {item.note}</span>}
            </span>
          </li>
        ))}
      </ul>
    </CalcSection>
  );
}

import {
  PiggyBank,
  Landmark,
  Calculator,
  TrendingUp,
  Target,
  Receipt,
} from "lucide-react";

import DashboardSection from "../../layout/DashboardSection";
import Button from "../../ui/Button";
import CalculatorCard from "./CalculatorCard";

const calculators = [
  {
    icon: "💰",
    title: "SIP Calculator",
    description:
      "Plan monthly investments and estimate long-term wealth through disciplined investing.",
    href: "/calculators/sip",
    badge: "Most Popular",
  },

  {
    icon: "🏦",
    title: "EMI Calculator",
    description:
      "Calculate monthly loan payments before making borrowing decisions.",
    href: "/calculators/emi",
    badge: "Essential",
  },

  {
    icon: "🎯",
    title: "Retirement Planner",
    description:
      "Estimate your retirement corpus and monthly investment requirement.",
    href: "/calculators/retirement",
    badge: "Long Term",
  },

  {
    icon: "📈",
    title: "FIRE Calculator",
    description:
      "Find your Financial Independence target and retirement timeline.",
    href: "/calculators/fire",
    badge: "Advanced",
  },

  {
    icon: "🏛",
    title: "FD Calculator",
    description:
      "Compare fixed deposit maturity values and expected returns.",
    href: "/calculators/fd",
    badge: "Safe Investing",
  },

  {
    icon: "🧾",
    title: "GST Calculator",
    description:
      "Calculate GST quickly for business, invoices and purchases.",
    href: "/calculators/gst",
    badge: "Business",
  },
];

export default function CalculatorShowcase() {
  return (
    <DashboardSection
      className="mt-24"
      title="Choose The Right Financial Calculator"
      subtitle="Professional financial calculators designed to help you make confident decisions—not just perform calculations."
      action={
        <Button
          variant="secondary"
          onClick={() => (window.location.href = "/calculators")}
        >
          View All Calculators
        </Button>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {calculators.map((calculator) => (
          <CalculatorCard
            key={calculator.title}
            {...calculator}
          />
        ))}
      </div>
    </DashboardSection>
  );
}
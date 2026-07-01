import {
  Calculator,
  LayoutDashboard,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

import DashboardSection from "../../layout/DashboardSection";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: Calculator,
    accent: "blue",
    title: "Smart Financial Calculators",
    description:
      "Professional calculators that do more than calculate. Save your progress, connect goals, and make informed financial decisions.",
  },

  {
    icon: LayoutDashboard,
    accent: "emerald",
    title: "Personal Financial Workspace",
    description:
      "Every calculator works together inside one intelligent workspace. Track goals, monitor progress, and continue where you left off.",
  },

  {
    icon: GraduationCap,
    accent: "violet",
    title: "Learn While Building Wealth",
    description:
      "Understand the reasoning behind every calculation with practical guides, lessons, and financial concepts designed for long-term success.",
  },

  {
    icon: ShieldCheck,
    accent: "amber",
    title: "Privacy First",
    description:
      "Your financial data stays on your device. No mandatory sign-up. No unnecessary data collection. You're always in control.",
  },
];

export default function WhyFINAIW() {
  return (
    <DashboardSection
      className="mt-24"
      title="Everything You Need To Make Better Financial Decisions."
      subtitle="FINAIW combines powerful calculators, a connected workspace, and practical financial learning into one seamless experience."
    >
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            {...feature}
          />
        ))}
      </div>
    </DashboardSection>
  );
}
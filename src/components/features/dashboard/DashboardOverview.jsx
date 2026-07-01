import {
  Wallet,
  Flame,
  Star,
  Target,
} from "lucide-react";

import DashboardSection from "../../layout/DashboardSection";
import StatCard from "../../cards/StatCard";

export default function DashboardOverview() {
  const stats = [
    {
      title: "Wealth Score",
      value: "82",
      subtitle: "+4 this week",
      icon: Wallet,
    },
    {
      title: "Current XP",
      value: "1,240",
      subtitle: "Level 8",
      icon: Star,
    },
    {
      title: "Current Streak",
      value: "18 Days",
      subtitle: "Personal Best",
      icon: Flame,
    },
    {
      title: "Active Goals",
      value: "5",
      subtitle: "2 completed",
      icon: Target,
    },
  ];

  return (
    <DashboardSection
      title="Your Financial Dashboard"
      subtitle="Track your overall financial progress at a glance."
    >
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
          />
        ))}
      </div>
    </DashboardSection>
  );
}
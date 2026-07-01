import {
  Wallet,
  Star,
  Flame,
  Target,
} from "lucide-react";

import StatCard from "../../cards/StatCard";

export default function HeroSummary() {
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
      subtitle: "2 Completed",
      icon: Target,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
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
  );
}
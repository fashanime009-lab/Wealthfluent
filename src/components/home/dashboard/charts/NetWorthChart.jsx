import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useMemo } from "react";
import { useWorkspace } from "../../../../context/WorkspaceContext";
import { useSettings } from "../../../../context/SettingsContext";
import { formatCurrency } from "../../../../utils/currency";

export default function NetWorthChart() {
  const { workspace } = useWorkspace();
  const { settings } = useSettings();

  const history = workspace.history?.netWorth || [];

  const data = useMemo(() => {
    if (history.length === 0) {
      return [
        { name: "Start", value: 0 },
        { name: "Now", value: 0 },
      ];
    }

    return history.map((item, index) => ({
      name: index + 1,
      value: item.value,
      date: item.date,
    }));
  }, [history]);

  return (
    <div className="relative mt-5 h-[118px] overflow-hidden rounded-xl bg-gradient-to-b from-emerald-50/90 to-white">

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient
              id="netWorthGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#10b981"
                stopOpacity={0.35}
              />

              <stop
                offset="100%"
                stopColor="#10b981"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <Tooltip
  contentStyle={{
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(15,23,42,.08)",
    background: "#fff",
  }}
  labelStyle={{
    color: "#64748b",
    fontWeight: 600,
  }}
  formatter={(value) => [
    formatCurrency(value, settings.currency),
    "Net Worth",
  ]}
/>

          <Area
  type="monotone"
  dataKey="value"
  stroke="#059669"
  strokeWidth={3}
  fill="url(#netWorthGradient)"
  animationDuration={1600}
animationEasing="ease-out"
  dot={false}
  activeDot={{
    r: 7,
    fill: "#059669",
    stroke: "#ffffff",
    strokeWidth: 3,
  }}
/>
        </AreaChart>
      </ResponsiveContainer>

      <span className="absolute right-3 top-3 rounded-full bg-emerald-700 px-3 py-1 text-[10px] font-bold text-white">
        Net Worth
      </span>
    </div>
  );
}
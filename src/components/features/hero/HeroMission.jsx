import { ArrowRight, Sparkles, Trophy } from "lucide-react";

import Card from "../../ui/Card";
import Badge from "../../ui/Badge";
import Button from "../../ui/Button";

export default function HeroMission() {
  return (
    <Card hover className="space-y-5">
      <div className="flex items-center justify-between">
        <Badge variant="primary">
          Today's Mission
        </Badge>

        <Sparkles
          size={20}
          className="text-blue-600"
        />
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Complete the Retirement Planner
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
          Estimate your retirement corpus and discover
          one action that could improve your future
          financial security.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Estimated Time
          </p>

          <p className="text-sm text-slate-500">
            5 minutes
          </p>
        </div>

        <div className="flex items-center gap-2 text-emerald-600">
          <Trophy size={18} />

          <span className="font-semibold">
            +15 XP
          </span>
        </div>
      </div>

      <Button
        fullWidth
        rightIcon={<ArrowRight size={18} />}
      >
        Continue Journey
      </Button>
    </Card>
  );
}
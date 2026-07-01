import { CheckCircle2, Edit3, Trash2, Target } from "lucide-react";

import Card from "../../ui/Card";
import Progress from "../../ui/Progress";
import Button from "../../ui/Button";

export default function GoalCard({
  goal,
  onEdit,
  onDelete,
  onComplete,
}) {
  return (
    <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div>

          <h3 className="text-xl font-bold text-slate-900">
            {goal.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {goal.type}
          </p>

        </div>

        <Target className="text-blue-600" size={22} />

      </div>

      {/* Progress */}
      <div className="mt-6">

        <div className="mb-2 flex justify-between">

          <span className="text-sm font-medium text-slate-500">
            Progress
          </span>

          <span className="font-semibold text-blue-600">
            {goal.progress}%
          </span>

        </div>

        <Progress
          value={goal.progress}
          showLabel={false}
        />

      </div>

      {/* Amount */}
      <div className="mt-5 flex justify-between text-sm">

        <span className="text-slate-500">
          ₹{goal.current?.toLocaleString()}
        </span>

        <span className="font-semibold text-slate-900">
          ₹{goal.target?.toLocaleString()}
        </span>

      </div>

      {/* Recommendation */}
      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">

        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          Next Action
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-700">
          {goal.recommendation ??
            "Continue contributing consistently toward your goal."}
        </p>

      </div>

      {/* Actions */}
      <div className="mt-6 grid grid-cols-3 gap-3">

        <Button
          variant="secondary"
          onClick={() => onEdit?.(goal)}
          leftIcon={<Edit3 size={16} />}
        >
          Edit
        </Button>

        <Button
          onClick={() => onComplete?.(goal)}
          leftIcon={<CheckCircle2 size={16} />}
        >
          Complete
        </Button>

        <Button
          variant="danger"
          onClick={() => onDelete?.(goal)}
          leftIcon={<Trash2 size={16} />}
        >
          Delete
        </Button>

      </div>

    </Card>
  );
}
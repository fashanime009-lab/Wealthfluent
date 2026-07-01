import Card from "../../ui/Card";
import Progress from "../../ui/Progress";
import Badge from "../../ui/Badge";
import {
  Wallet,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  PieChart,
  Landmark,
  Trophy,
  Crown,
  CheckCircle2,
} from "lucide-react";

const icons = {
  Wallet,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  PieChart,
  Landmark,
  Trophy,
  Crown,
};

export default function JourneyNode({ step }) {
  const Icon = icons[step.icon] || Wallet;

  return (
    <Card
      hover
      className={`relative h-full transition-all duration-300 ${
        step.current
          ? "ring-2 ring-blue-500 shadow-lg shadow-blue-100"
          : ""
      }`}
    >
      {/* Current Step */}
      {step.current && (
        <div className="absolute right-4 top-4">
          <Badge variant="primary">Current</Badge>
        </div>
      )}

      {/* Completed */}
      {step.progress === 100 && (
        <div className="absolute right-4 top-4 text-green-500">
          <CheckCircle2 size={22} />
        </div>
      )}

      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
        <Icon size={28} className="text-blue-600" />
      </div>

      <h3 className="text-lg font-semibold text-slate-900">
        {step.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {step.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge variant="secondary">
          {step.difficulty}
        </Badge>

        <Badge variant="success">
          +{step.xp} XP
        </Badge>
      </div>

      <div className="mt-6">
        <Progress value={step.progress} />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">
          {step.progress}% Complete
        </span>

        <span className="font-semibold text-blue-600">
          +{step.wealthScore} WS
        </span>
      </div>
    </Card>
  );
}
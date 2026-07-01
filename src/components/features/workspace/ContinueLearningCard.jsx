import {
  ArrowRight,
  BookOpen,
  Clock3,
  GraduationCap,
} from "lucide-react";

import Card from "../../ui/Card";
import Badge from "../../ui/Badge";
import Progress from "../../ui/Progress";
import Button from "../../ui/Button";

export default function ContinueLearningCard({ workspace }) {
  const { activeGoal } = workspace;

  const lesson = {
    title:
      activeGoal?.lesson ??
      "Financial Foundations",

    progress: 72,

    duration: "8 min",

    difficulty: "Beginner",

    description:
      activeGoal
        ? `Learn the concepts behind your "${activeGoal.title}" goal.`
        : "Build strong financial habits with bite-sized lessons.",
  };

  return (
    <Card>

      <Badge variant="primary">
        Continue Learning
      </Badge>

      <h2 className="mt-5 text-2xl text-black font-bold">
        {lesson.title}
      </h2>

      <p className="mt-3 leading-7 text-slate-500">
        {lesson.description}
      </p>

      <div className="mt-8">

        <div className="mb-2 flex items-center justify-between">

          <span className="text-sm font-medium text-slate-600">
            Course Progress
          </span>

          <span className="font-semibold text-blue-600">
            {lesson.progress}%
          </span>

        </div>

        <Progress
          value={lesson.progress}
          showLabel={false}
        />

      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">

        <div className="rounded-xl text-blue-600 border border-slate-200 p-4">

          <div className="flex items-center gap-2">

            <Clock3 size={18} />

            <span className="text-sm font-medium">
              Duration
            </span>

          </div>

          <p className="mt-2 text-lg font-bold">
            {lesson.duration}
          </p>

        </div>

        <div className="rounded-xl text-blue-600 border border-slate-200 p-4">

          <div className="flex items-center gap-2">

            <GraduationCap size={18} />

            <span className="text-sm font-medium">
              Level
            </span>

          </div>

          <p className="mt-2 text-lg font-bold">
            {lesson.difficulty}
          </p>

        </div>

      </div>

      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">

        <div className="flex items-center gap-3">

          <BookOpen
            className="text-blue-600"
            size={20}
          />

          <div>

            <p className="text-sm font-semibold text-blue-700">
              Recommended Next Lesson
            </p>

            <p className="text-slate-700">
              Understanding compound growth and long-term investing.
            </p>

          </div>

        </div>

      </div>

      <div className="mt-8">

        <Button
          rightIcon={<ArrowRight size={18} />}
        >
          Resume Learning
        </Button>

      </div>

    </Card>
  );
}
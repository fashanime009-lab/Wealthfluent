export default function GoalDetailsStep({
  goal,
  updateGoal,
  next,
  back,
}) {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[var(--text)]">
          Goal Details
        </h2>

        <p className="mt-2 text-[var(--text-secondary)]">
          Tell us about your financial goal.
        </p>
      </div>

      <div className="grid gap-6">

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--text)]">
            Goal Name
          </label>

          <input
            type="text"
            value={goal.title}
            onChange={(e) =>
              updateGoal({
                title: e.target.value,
              })
            }
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Emergency Fund"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text)]">
              Current Amount
            </label>

            <input
              type="number"
              min="0"
              value={goal.currentAmount}
              onChange={(e) =>
                updateGoal({
                  currentAmount: Number(e.target.value),
                })
              }
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 outline-none focus:border-blue-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text)]">
              Target Amount
            </label>

            <input
              type="number"
              min="0"
              value={goal.targetAmount}
              onChange={(e) =>
                updateGoal({
                  targetAmount: Number(e.target.value),
                })
              }
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 outline-none focus:border-blue-500"
              placeholder="1000000"
            />
          </div>

        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--text)]">
            Target Date
          </label>

          <input
            type="date"
            value={goal.targetDate}
            onChange={(e) =>
              updateGoal({
                targetDate: e.target.value,
              })
            }
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

      </div>

      <div className="mt-10 flex justify-between">

        <button
          onClick={back}
          className="rounded-xl border border-[var(--border)] px-6 py-3"
        >
          Back
        </button>

        <button
          onClick={next}
          disabled={!goal.title || goal.targetAmount <= 0}
          className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>

      </div>
    </>
  );
}
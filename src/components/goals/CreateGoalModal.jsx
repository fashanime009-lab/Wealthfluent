import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { createPersonalGoal, GOAL_CATEGORIES } from "@/services/personalGoals";

export default function CreateGoalModal({ open, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(GOAL_CATEGORIES[0].id);
  const [targetAmount, setTargetAmount] = useState("");
  const [startingAmount, setStartingAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const reset = () => {
    setTitle("");
    setCategory(GOAL_CATEGORIES[0].id);
    setTargetAmount("");
    setStartingAmount("");
    setTargetDate("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount) return;

    const goal = createPersonalGoal({
      title: title.trim(),
      category,
      targetAmount: Number(targetAmount),
      startingAmount: Number(startingAmount) || 0,
      targetDate: targetDate || null,
    });

    reset();
    onCreated?.(goal);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Create a goal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[12px] font-bold text-slate-500">What are you saving for?</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Trip to Japan, Emergency Fund"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-[14px] outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-[12px] font-bold text-slate-500">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[14px] outline-none focus:border-emerald-500"
          >
            {GOAL_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[12px] font-bold text-slate-500">Target amount</label>
            <input
              type="number"
              required
              min="1"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="500000"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-[14px] outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-[12px] font-bold text-slate-500">Already saved (optional)</label>
            <input
              type="number"
              min="0"
              value={startingAmount}
              onChange={(e) => setStartingAmount(e.target.value)}
              placeholder="0"
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-[14px] outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="text-[12px] font-bold text-slate-500">Target date (optional)</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-[14px] outline-none focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-800 py-3.5 text-[14px] font-black text-white transition hover:bg-emerald-900"
        >
          Create Goal
        </button>
      </form>
    </Modal>
  );
}

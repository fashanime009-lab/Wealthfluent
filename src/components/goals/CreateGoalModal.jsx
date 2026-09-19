import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { createPersonalGoal, GOAL_CATEGORIES } from "@/services/personalGoals";

const inputClass =
  "mt-1.5 w-full border border-[#111814]/15 bg-transparent px-4 py-3 text-[14px] text-[#111814] outline-none focus:border-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:focus:border-[#34d399]";
const labelClass = "text-[12px] font-semibold text-[#111814]/55 dark:text-[#eef1ec]/55";

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
          <label className={labelClass}>What are you saving for?</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Trip to Japan, Emergency Fund"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            {GOAL_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Target amount</label>
            <input
              type="number"
              required
              min="1"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="500000"
              className={`${inputClass} font-mono-tech`}
            />
          </div>
          <div>
            <label className={labelClass}>Already saved (optional)</label>
            <input
              type="number"
              min="0"
              value={startingAmount}
              onChange={(e) => setStartingAmount(e.target.value)}
              placeholder="0"
              className={`${inputClass} font-mono-tech`}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Target date (optional)</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#047857] py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#065f46]"
        >
          Create goal
        </button>
      </form>
    </Modal>
  );
}

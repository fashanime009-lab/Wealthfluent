import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { addContribution } from "@/services/personalGoals";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";

const inputClass =
  "mt-1.5 w-full border border-[#111814]/15 bg-transparent px-4 py-3 text-[14px] text-[#111814] outline-none focus:border-[#047857] dark:border-[#eef1ec]/15 dark:text-[#eef1ec] dark:focus:border-[#34d399]";
const labelClass = "text-[12px] font-semibold text-[#111814]/55 dark:text-[#eef1ec]/55";

export default function AddContributionModal({ open, onClose, goal, onAdded }) {
  const { settings } = useSettings();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  if (!goal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) === 0) return;
    const updated = addContribution(goal.id, Number(amount), note.trim());
    setAmount("");
    setNote("");
    onAdded?.(updated);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={`Add to "${goal.title}"`}>
      <p className="font-mono-tech text-[13px] tabular-nums text-[#111814]/55 dark:text-[#eef1ec]/55">
        Currently {formatCurrency(goal.currentAmount, settings.currency)} of {formatCurrency(goal.targetAmount, settings.currency)}
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className={labelClass}>Amount</label>
          <input
            type="number"
            required
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5000"
            className={`${inputClass} font-mono-tech`}
          />
          <p className="mt-1.5 text-[11px] text-[#111814]/45 dark:text-[#eef1ec]/45">Use a negative number to correct an overstated amount.</p>
        </div>
        <div>
          <label className={labelClass}>Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Bonus this month"
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#047857] py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#065f46]"
        >
          Add contribution
        </button>
      </form>
    </Modal>
  );
}

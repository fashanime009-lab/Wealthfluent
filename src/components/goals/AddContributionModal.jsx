import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { addContribution } from "@/services/personalGoals";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";

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
      <p className="text-[13px] text-slate-500">
        Currently {formatCurrency(goal.currentAmount, settings.currency)} of {formatCurrency(goal.targetAmount, settings.currency)}
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="text-[12px] font-bold text-slate-500">Amount</label>
          <input
            type="number"
            required
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5000"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-[14px] outline-none focus:border-emerald-500"
          />
          <p className="mt-1.5 text-[11px] text-slate-400">Use a negative number to correct an overstated amount.</p>
        </div>
        <div>
          <label className="text-[12px] font-bold text-slate-500">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Bonus this month"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-[14px] outline-none focus:border-emerald-500"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-800 py-3.5 text-[14px] font-black text-white transition hover:bg-emerald-900"
        >
          Add Contribution
        </button>
      </form>
    </Modal>
  );
}

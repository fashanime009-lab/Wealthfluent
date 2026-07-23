import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

export default function Toast({
  open,
  title,
  message,
  onClose,
}) {
  if (!open) return null;
  useEffect(() => {
  if (!open) return;

  const timer = setTimeout(() => {
    onClose();
  }, 3500);

  return () => clearTimeout(timer);
}, [open, onClose]);

  return (
    <div className="fixed top-20 right-6 z-[9999] animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="w-[calc(100vw-32px)] max-w-[380px] rounded-2xl border border-emerald-200 bg-white shadow-2xl">
        <div className="flex items-start gap-4 p-5">
          <div className="rounded-full bg-emerald-100 p-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">
              {title}
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {message}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 transition hover:bg-slate-100"
          >
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>

        <div className="h-1 overflow-hidden rounded-b-2xl bg-slate-100">
          <div className="h-full animate-[toast_3.5s_linear] bg-emerald-600" />
        </div>
      </div>
    </div>
  );
}
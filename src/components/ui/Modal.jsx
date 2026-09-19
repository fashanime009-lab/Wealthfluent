import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[#111814]/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md border border-[#111814]/12 bg-[#ffffff] p-7 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[19px] font-bold text-[#111814] dark:text-[#eef1ec]">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center text-[#111814]/45 hover:bg-[#111814]/5 hover:text-[#111814] dark:text-[#eef1ec]/45 dark:hover:bg-[#eef1ec]/10 dark:hover:text-[#eef1ec]"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

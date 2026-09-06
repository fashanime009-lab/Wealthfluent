export default function SectionTitle({ title, text, action }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-[28px] font-black tracking-[-0.035em] text-slate-950">{title}</h2>
        <p className="mt-2 text-[14px] font-semibold leading-6 text-slate-500">{text}</p>
      </div>
      {action}
    </div>
  );
}
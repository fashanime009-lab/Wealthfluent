import useTilt from "@/hooks/useTilt";

// The one signature "answer" readout, reused everywhere a calculator has a
// single headline number — same dark instrument panel as the homepage's
// live demo, so the whole site says "here's the number" the same way. The
// panel tilts toward the pointer, like a physical object rather than a
// flat rectangle — see useTilt for why it only ever responds to the cursor.
export default function CalcResultPanel({ label, value, note }) {
  const { ref, style, onPointerMove, onPointerLeave } = useTilt();

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={style}
      className="rounded-lg bg-[#0e1512] p-6 sm:p-7"
    >
      <p className="text-[13px] text-[#eef1ec]/55">{label}</p>
      <p className="font-mono-tech mt-1 text-[30px] font-medium leading-none tabular-nums text-[#34d399] sm:text-[46px]">
        {value}
      </p>
      {note && <p className="mt-3 text-[12.5px] text-[#eef1ec]/50">{note}</p>}
    </div>
  );
}

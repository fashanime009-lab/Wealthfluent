import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/utils/currency";
import { sipFutureValue } from "@/utils/projections";
import useAnimatedNumber from "@/hooks/useAnimatedNumber";
import useTilt from "@/hooks/useTilt";
import ProofStrip from "./ProofStrip";
import GrowthChart from "./GrowthChart";

const RATE = 12; // illustrative, fixed — the sliders that matter are the ones a visitor controls

export default function Hero() {
  const { settings } = useSettings();
  const fmt = (v) => formatCurrency(v, settings.currency, settings.compactNumbers);
  const { ref: panelRef, style: panelStyle, onPointerMove: onPanelMove, onPointerLeave: onPanelLeave } = useTilt();

  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(15);
  const futureValue = sipFutureValue(monthly, years, RATE);
  const animatedValue = useAnimatedNumber(futureValue);

  const series = useMemo(() => {
    const points = [];
    for (let y = 0; y <= years; y++) points.push(sipFutureValue(monthly, y, RATE));
    return points;
  }, [monthly, years]);

  return (
    <section className="mx-auto max-w-[1240px] px-5 pb-16 pt-12 sm:px-8 lg:px-12 lg:pt-20">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        {/* The live instrument — the hero's one bold, alive gesture */}
        <div
          ref={panelRef}
          onPointerMove={onPanelMove}
          onPointerLeave={onPanelLeave}
          style={panelStyle}
          className="rounded-lg bg-[#0e1512] p-6 sm:p-8"
        >
          <p className="text-[13px] font-medium text-[#eef1ec]/55">Move the sliders</p>

          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-3">
              <label className="text-[13px] text-[#eef1ec]/70">Monthly investment</label>
              <span className="font-mono-tech text-[15px] tabular-nums text-[#eef1ec]">{fmt(monthly)}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={100000}
              step={1000}
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className="instrument-range-panel mt-3 w-full"
            />
          </div>

          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-3">
              <label className="text-[13px] text-[#eef1ec]/70">Time horizon</label>
              <span className="font-mono-tech text-[15px] tabular-nums text-[#eef1ec]">{years} yrs</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="instrument-range-panel mt-3 w-full"
            />
          </div>

          <div className="mt-8 border-t border-[#eef1ec]/10 pt-6">
            <p className="text-[13px] text-[#eef1ec]/55">At {RATE}% expected return, that grows to</p>
            <p className="font-mono-tech mt-1 text-[28px] font-medium leading-none tabular-nums text-[#34d399] sm:text-[64px]">
              {fmt(Math.round(animatedValue))}
            </p>
          </div>

          <div className="mt-6">
            <GrowthChart series={series} height={130} />
          </div>
        </div>

        {/* Copy — quiet, left-aligned, no badge, no gradient */}
        <div>
          <h1 className="font-display max-w-[13ch] text-[34px] font-extrabold leading-[1.1] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[40px]">
            This is what your money actually does.
          </h1>
          <p className="mt-5 max-w-[46ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
            20 free calculators and 5 real decisions, decided — rent vs buy, debt vs invest, and more.
            No account, no paywall, and your numbers never leave your device.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              to="/calculators"
              className="inline-flex h-12 items-center bg-[#047857] px-6 text-[14px] font-semibold text-white transition hover:bg-[#065f46]"
            >
              Explore all calculators
            </Link>
            <Link
              to="/verdict"
              className="text-[14px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
            >
              Get a verdict instead
            </Link>
          </div>
          <ProofStrip />
        </div>
      </div>
    </section>
  );
}

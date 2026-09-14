import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import { getFinancialProfile } from "@/engine/financialProfile";
import { RISK_QUESTIONS, computeRiskProfile } from "@/engine/riskAnalyzerEngine";
import { TOOL_TONES } from "@/data/toolTones";

const tone = TOOL_TONES.riskAnalyzer;

const ASSET_LABELS = { equity: "Equity", debt: "Debt / Bonds", gold: "Gold", cash: "Cash" };

export default function InvestmentRiskAnalyzerPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const profile = useMemo(() => getFinancialProfile(), []);

  const totalSteps = RISK_QUESTIONS.length;
  const done = step >= totalSteps;
  const question = !done ? RISK_QUESTIONS[step] : null;

  const answer = (questionId, score) => {
    setAnswers((a) => ({ ...a, [questionId]: score }));
    setStep((s) => s + 1);
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  const result = done ? computeRiskProfile({ answers, profile }) : null;

  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
      <Seo
        title="Investment Risk Analyzer — Willingness vs Capacity Risk Profiling"
        description="A real two-sided risk-profiling tool: how much risk you're willing to take, reconciled against how much your actual finances can afford, with a recommended asset allocation."
        path="/investment-risk-analyzer"
        keywords="investment risk analyzer, risk profile, risk tolerance, asset allocation tool"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: "Investment Risk Analyzer", path: "/investment-risk-analyzer" },
        ])}
      />

      <div className="mx-auto max-w-[720px] px-5 py-16 sm:px-8 lg:px-12">
        <span className="text-[13px] font-semibold" style={{ color: tone.light }}>
          Tool, not a calculator
        </span>
        <h1 className="font-display mt-2 text-[32px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[40px]">
          Investment Risk Analyzer
        </h1>
        <p className="mt-4 max-w-[60ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
          Most risk quizzes just ask how you feel about risk. This asks that, then checks it against
          what your real finances can actually absorb — and gives you the more conservative of the
          two, explained.
        </p>

        {!done ? (
          <QuestionStep question={question} step={step} total={totalSteps} onAnswer={answer} onBack={() => setStep((s) => Math.max(0, s - 1))} />
        ) : (
          <ResultView result={result} hasProfile={Boolean(profile)} onRestart={restart} />
        )}
      </div>
    </div>
  );
}

function QuestionStep({ question, step, total, onAnswer, onBack }) {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <span className="font-mono-tech text-[12px] text-[#111814]/45 dark:text-[#eef1ec]/45">
          Question {step + 1} of {total}
        </span>
        {step > 0 && (
          <button
            type="button"
            onClick={onBack}
            className="text-[12px] font-semibold text-[#111814]/55 hover:text-[#111814] dark:text-[#eef1ec]/55 dark:hover:text-[#eef1ec]"
          >
            Back
          </button>
        )}
      </div>

      <div className="mt-3 h-1 w-full bg-[#111814]/10 dark:bg-[#eef1ec]/10">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${(step / total) * 100}%`, backgroundColor: tone.light }}
        />
      </div>

      <h2 className="font-display mt-8 text-[22px] font-bold leading-snug text-[#111814] dark:text-[#eef1ec]">
        {question.question}
      </h2>

      <div className="mt-6 space-y-2.5">
        {question.options.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => onAnswer(question.id, opt.score)}
            className="block w-full border border-[#111814]/15 px-5 py-4 text-left text-[14px] font-medium text-[#111814] transition hover:border-[var(--tone-hover)] dark:border-[#eef1ec]/15 dark:text-[#eef1ec]"
            style={{ "--tone-hover": tone.light }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultView({ result, hasProfile, onRestart }) {
  const { willingness, capacity, willingnessCategory, capacityCategory, finalCategory, wasCapped, allocation } = result;

  return (
    <div className="mt-10">
      <div className="border-l-4 p-6" style={{ borderColor: tone.bright, backgroundColor: tone.panel }}>
        <span className="text-[12px] font-semibold" style={{ color: tone.bright }}>
          Your risk profile
        </span>
        <h2 className="font-display mt-1.5 text-[24px] font-bold text-[#eef1ec]">{finalCategory.label}</h2>
        <p className="mt-2 max-w-[56ch] text-[13.5px] leading-6 text-[#eef1ec]/60">
          {wasCapped
            ? `Your quiz answers scored as ${willingnessCategory.label}, but your real financial profile — debt load, emergency fund, savings rate — can only comfortably support ${capacityCategory.label}. We've used the more conservative one, so a bad year doesn't leave you exposed.`
            : hasProfile
              ? "Your comfort with risk and your real financial capacity to take it are in step with each other."
              : "This is based on your quiz answers only. Set up your financial profile to check it against your real capacity to absorb risk, not just your comfort with it."}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ScoreBlock label="Willingness" sub="how you feel about risk" score={willingness} category={willingnessCategory} />
        {capacity !== null ? (
          <ScoreBlock label="Capacity" sub="what your finances can absorb" score={capacity} category={capacityCategory} />
        ) : (
          <div className="border border-[#111814]/15 p-5 dark:border-[#eef1ec]/15">
            <p className="text-[13px] font-semibold text-[#111814]/55 dark:text-[#eef1ec]/55">Capacity — not available</p>
            <p className="mt-2 text-[12.5px] leading-5 text-[#111814]/45 dark:text-[#eef1ec]/45">
              Set up your{" "}
              <Link to="/financial-profile" className="font-semibold underline decoration-current/30 underline-offset-2" style={{ color: tone.light }}>
                financial profile
              </Link>{" "}
              to see how much risk you can actually afford, not just how you feel about it.
            </p>
          </div>
        )}
      </div>

      <div className="mt-10">
        <h3 className="font-display text-[17px] font-bold text-[#111814] dark:text-[#eef1ec]">
          Model allocation for {finalCategory.label}
        </h3>
        <p className="mt-1.5 text-[13px] text-[#111814]/55 dark:text-[#eef1ec]/55">
          Illustrative expected return: {allocation.expectedReturn} per year. A model, not personalized advice.
        </p>

        <div className="mt-5 flex h-8 w-full overflow-hidden">
          {["equity", "debt", "gold", "cash"].map((key, i) => (
            <div
              key={key}
              className="h-full"
              style={{ width: `${allocation[key]}%`, backgroundColor: tone.bright, opacity: 1 - i * 0.22 }}
              title={`${ASSET_LABELS[key]}: ${allocation[key]}%`}
            />
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {["equity", "debt", "gold", "cash"].map((key) => (
            <div key={key}>
              <span className="font-mono-tech text-[17px] font-medium tabular-nums text-[#111814] dark:text-[#eef1ec]">
                {allocation[key]}%
              </span>
              <p className="mt-0.5 text-[12px] text-[#111814]/55 dark:text-[#eef1ec]/55">{ASSET_LABELS[key]}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10">
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex h-11 items-center px-5 text-[13px] font-semibold text-white transition"
          style={{ backgroundColor: tone.light }}
        >
          Retake the quiz
        </button>
        <Link
          to="/calculators"
          className="text-[13.5px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
        >
          Explore calculators
        </Link>
      </div>

      <Methodology />
    </div>
  );
}

function ScoreBlock({ label, sub, score, category }) {
  return (
    <div className="border border-[#111814]/15 p-5 dark:border-[#eef1ec]/15">
      <div className="flex items-baseline justify-between">
        <p className="text-[13px] font-semibold text-[#111814] dark:text-[#eef1ec]">{label}</p>
        <span className="font-mono-tech text-[13px] tabular-nums text-[#111814]/55 dark:text-[#eef1ec]/55">{score}/100</span>
      </div>
      <p className="mt-1 text-[12px] text-[#111814]/45 dark:text-[#eef1ec]/45">{sub}</p>
      <div className="mt-3 h-1.5 w-full bg-[#111814]/10 dark:bg-[#eef1ec]/10">
        <div className="h-full" style={{ width: `${score}%`, backgroundColor: tone.light }} />
      </div>
      <p className="mt-2 text-[12.5px] font-semibold" style={{ color: tone.light }}>
        {category.label}
      </p>
    </div>
  );
}

function Methodology() {
  return (
    <div className="mt-14 border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10">
      <h2 className="font-display text-[15px] font-bold text-[#111814] dark:text-[#eef1ec]">How this is computed</h2>
      <p className="mt-2 max-w-[62ch] text-[13px] leading-6 text-[#111814]/55 dark:text-[#eef1ec]/55">
        Willingness is a weighted score across 8 questions — how you'd react to a real 20% drop
        counts for more than, say, your liquidity needs. Capacity reuses the same rubric behind
        your financial health score: savings rate, emergency fund coverage, debt-to-income, and net
        worth. The final profile takes the lower of the two, because being willing to take a loss
        doesn't help if your finances can't actually absorb one. This is a planning model, not
        personalized investment advice — consult a licensed advisor before acting on it.
      </p>
    </div>
  );
}

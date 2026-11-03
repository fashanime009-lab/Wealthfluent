import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema, faqSchema } from "@/components/seo/schema";
import { getFinancialProfile } from "@/engine/financialProfile";
import { RISK_QUESTIONS, ALLOCATION_MODELS, computeRiskProfile } from "@/engine/riskAnalyzerEngine";
import { TOOL_TONES } from "@/data/toolTones";
import CalcSection from "@/components/calculators/CalcSection";
import VerdictFAQ from "@/components/verdict/VerdictFAQ";

const tone = TOOL_TONES.riskAnalyzer;

const ASSET_LABELS = { equity: "Equity", debt: "Debt / Bonds", gold: "Gold", cash: "Cash" };

const PROFILE_LABELS = {
  conservative: "Conservative",
  moderate: "Moderate",
  balanced: "Balanced",
  growth: "Growth",
  aggressive: "Aggressive",
};

const FAQ_ITEMS = [
  {
    q: "What is the difference between risk willingness and risk capacity?",
    a: "Willingness is how much volatility you are comfortable with: how you would react to a fall, how long you can wait, how much uncertainty you can live with. Capacity is how much volatility your finances can actually absorb, based on your savings rate, emergency fund, debt and net worth. They often disagree, which is why this tool measures both.",
  },
  {
    q: "Why does the result use the lower of the two scores?",
    a: "Because being willing to take a loss doesn't help if your finances can't absorb one. Someone with no emergency fund and high EMIs may be forced to sell investments at the bottom of a crash to pay bills, whatever their temperament. Taking the more conservative of the two protects against that.",
  },
  {
    q: "Do I need to enter my income and savings to use it?",
    a: "No. Without a financial profile you still get a result from your quiz answers alone, and the result says so clearly. Adding a financial profile lets the tool check your answers against your real capacity. The profile is saved only in your browser and never sent to our servers.",
  },
  {
    q: "Is the model allocation a recommendation to buy specific funds?",
    a: "No. The allocations are illustrative round numbers that show the shape of a sensible portfolio at each risk level. They don't account for your taxes, existing holdings or goals, and they are not investment advice. Speak to a SEBI-registered investment adviser before acting on them.",
  },
  {
    q: "How often should I retake the risk profile?",
    a: "Retake it whenever your situation changes in a meaningful way, such as a new job, marriage, a child, a big loan or getting close to a goal, and at least once a year. Your capacity for risk usually changes faster than your feelings about it.",
  },
];

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
        jsonLd={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "Investment Risk Analyzer", path: "/investment-risk-analyzer" },
          ]),
          faqSchema(FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <div className="mx-auto max-w-[720px] px-5 py-16 sm:px-8 lg:px-12">
        <span className="text-[13px] font-semibold text-[color:var(--tone-light)] dark:text-[color:var(--tone-bright)]" style={{ "--tone-light": tone.light, "--tone-bright": tone.bright }}>
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

        <AboutRiskProfiling />
      </div>
    </div>
  );
}

function QuestionStep({ question, step, total, onAnswer, onBack }) {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <span className="font-mono-tech text-[12px] text-[#111814]/60 dark:text-[#eef1ec]/50">
          Question {step + 1} of {total}
        </span>
        {step > 0 && (
          <button
            type="button"
            onClick={onBack}
            className="text-[12px] font-semibold text-[#111814]/60 hover:text-[#111814] dark:text-[#eef1ec]/55 dark:hover:text-[#eef1ec]"
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
            <p className="text-[13px] font-semibold text-[#111814]/60 dark:text-[#eef1ec]/55">Capacity — not available</p>
            <p className="mt-2 text-[12.5px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
              Set up your{" "}
              <Link to="/financial-profile" className="font-semibold underline decoration-current/30 underline-offset-2 text-[color:var(--tone-light)] dark:text-[color:var(--tone-bright)]" style={{ "--tone-light": tone.light, "--tone-bright": tone.bright }}>
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
        <p className="mt-1.5 text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">
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
              <p className="mt-0.5 text-[12px] text-[#111814]/60 dark:text-[#eef1ec]/55">{ASSET_LABELS[key]}</p>
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
    </div>
  );
}

function ScoreBlock({ label, sub, score, category }) {
  return (
    <div className="border border-[#111814]/15 p-5 dark:border-[#eef1ec]/15">
      <div className="flex items-baseline justify-between">
        <p className="text-[13px] font-semibold text-[#111814] dark:text-[#eef1ec]">{label}</p>
        <span className="font-mono-tech text-[13px] tabular-nums text-[#111814]/60 dark:text-[#eef1ec]/55">{score}/100</span>
      </div>
      <p className="mt-1 text-[12px] text-[#111814]/60 dark:text-[#eef1ec]/50">{sub}</p>
      <div className="mt-3 h-1.5 w-full bg-[#111814]/10 dark:bg-[#eef1ec]/10">
        <div className="h-full" style={{ width: `${score}%`, backgroundColor: tone.light }} />
      </div>
      <p className="mt-2 text-[12.5px] font-semibold text-[color:var(--tone-light)] dark:text-[color:var(--tone-bright)]" style={{ "--tone-light": tone.light, "--tone-bright": tone.bright }}>
        {category.label}
      </p>
    </div>
  );
}

// Always rendered, not only after the quiz is finished: before this, the
// page's only text for a first-time visitor (and for Google) was the
// intro paragraph and the first question.
function AboutRiskProfiling() {
  return (
    <div className="mt-16 space-y-10">
      <CalcSection title="How this is computed">
        <p>
          Willingness is a weighted score across {RISK_QUESTIONS.length} questions. How you'd react
          to a real 20% drop and when you'll need the money count for more than, say, your
          investing experience. The answers are combined into a score from 0 to 100.
        </p>
        <p>
          Capacity reuses the same rubric behind your financial health score: savings rate,
          emergency fund coverage, debt-to-income and net worth. The final profile takes the lower
          of the two, because being willing to take a loss doesn't help if your finances can't
          actually absorb one.
        </p>
        <p>
          This is a planning model, not personalized investment advice. Consult a SEBI-registered
          investment adviser before acting on it.
        </p>
      </CalcSection>

      <CalcSection title="Why two scores instead of one">
        <p>
          Most online risk quizzes ask only how you feel about risk. That misses half the picture.
          Take two people who both say they would buy more if the market fell 20%. The first has
          six months of expenses saved and no loans. The second has no emergency fund and an EMI
          that takes 45% of their salary. On paper they have the same appetite for risk, but only
          the first can sit through a crash without being forced to sell.
        </p>
        <p>
          Financial planners call these two sides risk tolerance (or willingness) and risk
          capacity. This tool scores them separately and tells you when they disagree, so you can
          see whether your comfort with risk or your finances are the real limit.
        </p>
      </CalcSection>

      <CalcSection title="The five risk profiles">
        <p>
          Your final score places you in one of five profiles. Each comes with an illustrative
          model allocation across equity, debt, gold and cash, and the illustrative long-run return
          range this tool assumes for that mix. Returns are never guaranteed, and higher-equity
          mixes can fall much further in a bad year.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#111814]/15 text-[#111814] dark:border-[#eef1ec]/15 dark:text-[#eef1ec]">
                <th className="py-2 pr-4 font-semibold">Profile</th>
                {Object.values(ASSET_LABELS).map((label) => (
                  <th key={label} className="py-2 pr-4 font-semibold">{label}</th>
                ))}
                <th className="py-2 font-semibold">Illustrative return</th>
              </tr>
            </thead>
            <tbody className="font-mono-tech tabular-nums">
              {Object.entries(ALLOCATION_MODELS).map(([id, model]) => (
                <tr key={id} className="border-b border-[#111814]/10 dark:border-[#eef1ec]/10">
                  <td className="py-2 pr-4 font-sans font-semibold text-[#111814] dark:text-[#eef1ec]">{PROFILE_LABELS[id]}</td>
                  {Object.keys(ASSET_LABELS).map((key) => (
                    <td key={key} className="py-2 pr-4">{model[key]}%</td>
                  ))}
                  <td className="py-2">{model.expectedReturn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CalcSection>

      <CalcSection title="How to use your result">
        <p>
          Treat the profile as a starting point for a conversation, not an order. Compare the model
          allocation with what you hold today across mutual funds, stocks, PPF, EPF, FDs and gold.
          If your real mix carries far more equity than your profile, a market fall could hurt more
          than you expect. If it carries far less, you may be giving up growth you can afford.
        </p>
        <p>
          If your capacity score is the one holding you back, the fix is usually not a riskier
          portfolio but a stronger base: build an emergency fund with the{" "}
          <Link to="/emergency-fund-calculator" className="font-semibold underline decoration-current/30 underline-offset-2">
            emergency fund calculator
          </Link>{" "}
          or clear expensive debt with the{" "}
          <Link to="/debt-payoff-planner" className="font-semibold underline decoration-current/30 underline-offset-2">
            debt payoff planner
          </Link>
          , then retake the profile.
        </p>
      </CalcSection>

      <VerdictFAQ items={FAQ_ITEMS} className="border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10" />
    </div>
  );
}

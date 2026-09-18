import { useEffect, useMemo, useState } from "react";
import { fetchNews } from "../services/newsService";
import Seo from "../components/seo/Seo";
import { breadcrumbSchema } from "../components/seo/schema";
import { CheckCircle2, Loader2, RotateCcw, XCircle } from "lucide-react";
import useTilt from "@/hooks/useTilt";
import useVisibleInterval from "@/hooks/useVisibleInterval";

// Falls back to these when the live-headlines quiz can't fetch fresh
// articles — either a real network hiccup, or (always, unavoidably)
// during static prerendering, since the local build server has no real
// API behind it (see scripts/prerender.mjs). A 2-question fallback read
// as thin content in an AdSense review; ten genuine finance-basics
// questions keeps the page substantial either way, and doubles as an
// always-available quiz for anyone who'd rather not wait on live data.
const fallbackQuestions = [
  {
    id: "fallback-etf",
    question: "What does ETF usually stand for in investing?",
    options: ["Electronic Trading Fund", "Exchange Traded Fund", "Equity Transfer Fund", "External Treasury Fund"],
    answer: "Exchange Traded Fund",
    explanation: "ETF stands for Exchange Traded Fund.",
    source: "Finance basics",
  },
  {
    id: "fallback-inflation",
    question: "What does inflation measure?",
    options: ["Rise in prices", "Fall in taxes", "Company profit", "Export volume"],
    answer: "Rise in prices",
    explanation: "Inflation measures the rate at which prices rise over time.",
    source: "Finance basics",
  },
  {
    id: "fallback-sip",
    question: "What does SIP stand for in mutual fund investing?",
    options: ["Systematic Investment Plan", "Stock Investment Program", "Secured Income Plan", "Standard Interest Payment"],
    answer: "Systematic Investment Plan",
    explanation: "SIP stands for Systematic Investment Plan — investing a fixed amount at regular intervals.",
    source: "Finance basics",
  },
  {
    id: "fallback-compound",
    question: "Compound interest is calculated on which amount?",
    options: ["Principal plus accumulated interest", "Principal only", "Interest only", "A fixed government rate"],
    answer: "Principal plus accumulated interest",
    explanation: "Compound interest is earned on the principal plus any interest already added to it — that's what makes it grow faster than simple interest.",
    source: "Finance basics",
  },
  {
    id: "fallback-diversification",
    question: "Spreading investments across different assets to reduce risk is called...",
    options: ["Diversification", "Consolidation", "Leveraging", "Arbitrage"],
    answer: "Diversification",
    explanation: "Diversification spreads risk across different investments so one bad outcome doesn't sink the whole portfolio.",
    source: "Finance basics",
  },
  {
    id: "fallback-credit-score",
    question: "A higher credit score generally leads to...",
    options: ["Lower interest rates on loans", "Higher interest rates on loans", "No effect on loans", "Automatic loan approval"],
    answer: "Lower interest rates on loans",
    explanation: "Lenders reward a strong repayment history with better interest rates, since a higher score signals lower risk.",
    source: "Finance basics",
  },
  {
    id: "fallback-emergency-fund",
    question: "An emergency fund is best kept in...",
    options: ["A liquid, easily accessible account", "Long-term equity", "Real estate", "Cryptocurrency"],
    answer: "A liquid, easily accessible account",
    explanation: "An emergency fund needs to be accessible within a day or two without penalty or market risk — not tied up in something volatile or illiquid.",
    source: "Finance basics",
  },
  {
    id: "fallback-emi",
    question: "EMI, as in a loan EMI, stands for...",
    options: ["Equated Monthly Installment", "Extra Monthly Income", "Equity Market Index", "Estimated Monthly Interest"],
    answer: "Equated Monthly Installment",
    explanation: "EMI stands for Equated Monthly Installment — a fixed monthly payment that covers both principal and interest.",
    source: "Finance basics",
  },
  {
    id: "fallback-net-worth",
    question: "Net worth is calculated as...",
    options: ["Assets minus liabilities", "Income minus expenses", "Savings plus debt", "Revenue minus profit"],
    answer: "Assets minus liabilities",
    explanation: "Net worth is everything you own minus everything you owe — a snapshot of real financial position, not just income.",
    source: "Finance basics",
  },
  {
    id: "fallback-bear-market",
    question: "A \"bear market\" refers to a period when...",
    options: ["Prices are generally falling", "Prices are generally rising", "Prices are stable", "Trading is suspended"],
    answer: "Prices are generally falling",
    explanation: "A bear market describes a sustained period of falling prices — the opposite of a \"bull market,\" where prices are rising.",
    source: "Finance basics",
  },
];

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function makeQuestion(article, allArticles, index) {
  const title = article.title;
  const source =
  article.source || "News";
  const category =
  article.category || "business";
  const otherSources = allArticles
    .map((item) => item.source)
    .filter((item) => item && item !== source);
  const otherTitles = allArticles
    .map((item) => item.title)
    .filter((item) => item && item !== title)
    .slice(0, 8);

  if (index % 3 === 0 && otherSources.length >= 3) {
    return {
      id: article.id || `${title}-${index}`,
      question: `Which source published this finance headline: "${title}"?`,
      options: shuffle([source, ...shuffle(otherSources).slice(0, 3)]),
      answer: source,
      explanation: `This headline was published by ${source}.`,
      source,
    };
  }

  if (index % 3 === 1 && otherTitles.length >= 3) {
    return {
      id: article.id || `${title}-${index}`,
      question: `Which headline is currently connected to ${source}?`,
      options: shuffle([title, ...shuffle(otherTitles).slice(0, 3)]),
      answer: title,
      explanation: `The live article from ${source} is "${title}".`,
      source,
    };
  }

  return {
    id: article.id || `${title}-${index}`,
    question: `Which topic best matches this live article from ${source}?`,
    options: shuffle([category, "sports", "entertainment", "travel"]),
    answer: category,
    explanation: `This article belongs to the ${category} category.`,
    source,
  };
}

async function fetchQuizQuestions() {
  const data = await fetchNews({
  limit: 20,
});

const articles = data.articles;
  const questions = articles.slice(0, 18).map((article, index) => makeQuestion(article, articles, index));

  return questions.length ? questions : fallbackQuestions;
}

export default function QuizzesPage() {
  const { ref: scoreRef, style: scoreStyle, onPointerMove: onScoreMove, onPointerLeave: onScoreLeave } = useTilt();
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const score = useMemo(() => {
    return questions.reduce((total, item) => {
      if (!submitted[item.id]) return total;
      return selected[item.id] === item.answer ? total + 1 : total;
    }, 0);
  }, [questions, selected, submitted]);

  const answeredCount = Object.keys(submitted).length;

  const loadQuestions = async () => {
    setLoading(true);

    try {
      const nextQuestions = await fetchQuizQuestions();
      setQuestions(nextQuestions);
      setSelected({});
      setSubmitted({});
      setLastUpdated(new Date());
      setError("");
    } catch {
      setQuestions(fallbackQuestions);
      setLastUpdated(new Date());
      setError("Couldn't load fresh questions right now — here are some finance basics instead.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  useVisibleInterval(loadQuestions, 120000);

  const chooseAnswer = (questionId, answer) => {
    setSelected((current) => ({ ...current, [questionId]: answer }));
    setSubmitted((current) => {
      const next = { ...current };
      delete next[questionId];
      return next;
    });
  };

  const submitAnswer = (questionId) => {
    if (!selected[questionId]) return;
    setSubmitted((current) => ({ ...current, [questionId]: true }));
  };

  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
      <Seo
        title="Quizzes — Test Your Financial Knowledge"
        description="Questions generated from live finance and business headlines, so the quiz keeps changing without manual updates. Free, no signup."
        path="/quizzes"
        keywords="finance quiz, investing quiz, personal finance test, financial literacy quiz"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Quizzes", path: "/quizzes" },
        ])}
      />
      <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">Refreshed every 2 minutes</span>
            <h1 className="font-display mt-2 max-w-lg text-[34px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[42px]">
              View all quizzes
            </h1>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
              Questions are generated from live finance and business headlines, so the quiz keeps
              changing without manual updates.
            </p>
          </div>

          <aside
            ref={scoreRef}
            onPointerMove={onScoreMove}
            onPointerLeave={onScoreLeave}
            style={scoreStyle}
            className="rounded-lg bg-[#0e1512] p-6 sm:p-7"
          >
            <p className="text-[13px] text-[#eef1ec]/55">FinQuiz score</p>
            <p className="font-mono-tech mt-1 text-[40px] font-medium leading-none tabular-nums text-[#34d399] sm:text-[46px]">
              {score}/{answeredCount || 0}
            </p>
            <p className="mt-3 text-[12.5px] text-[#eef1ec]/45">
              {lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
                : "Connecting"}
              {" — answer more questions to improve your score."}
            </p>
          </aside>
        </div>

        {error && (
          <p className="mt-6 border border-[#111814]/12 px-4 py-3 text-[13.5px] font-medium text-amber-700 dark:border-[#eef1ec]/12 dark:text-amber-400">
            {error}
          </p>
        )}

        {loading && (
          <div className="mt-10 flex items-center justify-center gap-3 text-[13.5px] font-medium text-[#111814]/55 dark:text-[#eef1ec]/55">
            <Loader2 className="animate-spin" size={18} />
            Loading live quiz questions...
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {questions.map((item, index) => {
            const chosen = selected[item.id];
            const isSubmitted = Boolean(submitted[item.id]);
            const isCorrect = chosen === item.answer;

            return (
              <article key={item.id} className="border border-[#111814]/12 bg-[#ffffff] p-6 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[12px] font-semibold text-[#047857] dark:text-[#34d399]">Question {index + 1}</span>
                  <span className="text-[11.5px] text-[#111814]/45 dark:text-[#eef1ec]/45">{item.source}</span>
                </div>
                <h2 className="font-display mt-4 text-[18px] font-bold leading-snug text-[#111814] dark:text-[#eef1ec]">
                  {item.question}
                </h2>
                <div className="mt-5 space-y-2">
                  {item.options.map((option) => {
                    const active = chosen === option;
                    const correctStyle = isSubmitted && option === item.answer;
                    const wrongStyle = isSubmitted && active && option !== item.answer;

                    return (
                      <button
                        key={option}
                        onClick={() => chooseAnswer(item.id, option)}
                        className={`flex w-full items-center justify-between border px-4 py-3 text-left text-[13.5px] font-medium transition ${
                          correctStyle
                            ? "border-[#047857]/50 text-[#047857] dark:border-[#34d399]/50 dark:text-[#34d399]"
                            : wrongStyle
                              ? "border-red-400/60 text-red-600 dark:border-red-400/40 dark:text-red-400"
                              : active
                                ? "border-[#111814]/60 text-[#111814] dark:border-[#eef1ec]/60 dark:text-[#eef1ec]"
                                : "border-[#111814]/12 text-[#111814]/70 hover:border-[#111814]/30 dark:border-[#eef1ec]/12 dark:text-[#eef1ec]/70 dark:hover:border-[#eef1ec]/30"
                        }`}
                      >
                        {option}
                        {correctStyle && <CheckCircle2 size={16} />}
                        {wrongStyle && <XCircle size={16} />}
                      </button>
                    );
                  })}
                </div>
                {isSubmitted && (
                  <p className={`mt-5 text-[13.5px] font-medium ${isCorrect ? "text-[#047857] dark:text-[#34d399]" : "text-red-600 dark:text-red-400"}`}>
                    {isCorrect ? "Correct." : "Not quite."} {item.explanation}
                  </p>
                )}
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => chooseAnswer(item.id, "")}
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#111814]/55 transition hover:text-[#111814] dark:text-[#eef1ec]/55 dark:hover:text-[#eef1ec]"
                  >
                    <RotateCcw size={14} />
                    Reset
                  </button>
                  <button
                    onClick={() => submitAnswer(item.id)}
                    className="border border-[#111814] px-5 py-2 text-[13px] font-semibold text-[#111814] transition hover:bg-[#111814] hover:text-[#eef1ec] disabled:cursor-not-allowed disabled:border-[#111814]/20 disabled:text-[#111814]/30 disabled:hover:bg-transparent dark:border-[#eef1ec] dark:text-[#eef1ec] dark:hover:bg-[#eef1ec] dark:hover:text-[#0b1210] dark:disabled:border-[#eef1ec]/20 dark:disabled:text-[#eef1ec]/30"
                    disabled={!chosen}
                  >
                    Submit
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

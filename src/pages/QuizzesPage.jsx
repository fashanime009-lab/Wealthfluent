import { useEffect, useMemo, useState } from "react";
import { fetchNews } from "../services/newsService";
import Seo from "../components/seo/Seo";
import { breadcrumbSchema } from "../components/seo/schema";
import {
  Bot,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";





const fallbackQuestions = [
  {
    id: "fallback-etf",
    question: "What does ETF usually stand for in investing?",
    options: ["Electronic Trading Fund", "Exchange Traded Fund", "Equity Transfer Fund", "External Treasury Fund"],
    answer: "Exchange Traded Fund",
    explanation: "ETF stands for Exchange Traded Fund.",
    source: "Fallback finance basics",
  },
  {
    id: "fallback-inflation",
    question: "What does inflation measure?",
    options: ["Rise in prices", "Fall in taxes", "Company profit", "Export volume"],
    answer: "Rise in prices",
    explanation: "Inflation measures the rate at which prices rise over time.",
    source: "Fallback finance basics",
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
      setError("Live quiz API unavailable. Showing finance basics until the feed returns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
    const interval = window.setInterval(loadQuestions, 120000);
    return () => window.clearInterval(interval);
  }, []);

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
    <main className="min-h-screen bg-[#fbfdfc]">
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
      <section className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[12px] font-black text-emerald-800 ring-1 ring-emerald-100">
              <Sparkles size={13} /> API Generated
            </span>
            <h1 className="mt-5 text-[38px] font-black leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-[48px]">
              View all quizzes
            </h1>
            <p className="mt-3 max-w-3xl text-[15px] font-medium leading-7 text-slate-500">
              Questions are generated from live finance and business headlines, so the quiz keeps
              changing without manual updates.
            </p>
          </div>

          <aside className="rounded-3xl bg-[#061225] p-6 text-white">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20">
                <Bot size={22} />
              </span>
              <div>
                <h2 className="text-[17px] font-black">FinQuiz Score</h2>
                <p className="text-[12.5px] font-semibold text-slate-400">
                  {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "Connecting"}
                </p>
              </div>
            </div>
            <div className="mt-7 text-[42px] font-black leading-none">{score}/{answeredCount || 0}</div>
            <p className="mt-3 text-[12.5px] font-semibold text-slate-400">Answer more questions to improve your score.</p>
          </aside>
        </div>

        {error && (
          <p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-[13.5px] font-semibold text-amber-700 ring-1 ring-amber-100">
            {error}
          </p>
        )}

        {loading && (
          <div className="mt-10 flex items-center justify-center gap-3 text-[13.5px] font-semibold text-slate-500">
            <Loader2 className="animate-spin" size={18} />
            Loading live quiz questions...
          </div>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {questions.map((item, index) => {
            const chosen = selected[item.id];
            const isSubmitted = Boolean(submitted[item.id]);
            const isCorrect = chosen === item.answer;

            return (
              <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700 ring-1 ring-emerald-100">Question {index + 1}</span>
                  <span className="text-[11.5px] font-semibold text-slate-400">{item.source}</span>
                </div>
                <h2 className="mt-5 text-[19px] font-black leading-snug text-slate-950">{item.question}</h2>
                <div className="mt-6 space-y-2.5">
                  {item.options.map((option) => {
                    const active = chosen === option;
                    const correctStyle = isSubmitted && option === item.answer;
                    const wrongStyle = isSubmitted && active && option !== item.answer;

                    return (
                      <button
                        key={option}
                        onClick={() => chooseAnswer(item.id, option)}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-[13.5px] font-semibold transition ${
                          correctStyle
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : wrongStyle
                              ? "border-red-300 bg-red-50 text-red-700"
                              : active
                                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200"
                        }`}
                      >
                        {option}
                        {correctStyle && <CheckCircle2 size={18} />}
                        {wrongStyle && <XCircle size={18} />}
                      </button>
                    );
                  })}
                </div>
                {isSubmitted && (
                  <p className={`mt-5 text-[13.5px] font-semibold ${isCorrect ? "text-emerald-700" : "text-red-600"}`}>
                    {isCorrect ? "Correct." : "Not quite."} {item.explanation}
                  </p>
                )}
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={() => chooseAnswer(item.id, "")}
                    className="inline-flex items-center gap-2 text-[13px] font-black text-slate-500 transition hover:text-slate-800"
                  >
                    <RotateCcw size={15} />
                    Reset
                  </button>
                  <button
                    onClick={() => submitAnswer(item.id)}
                    className="rounded-xl bg-emerald-800 px-5 py-2.5 text-[13px] font-black text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-slate-300"
                    disabled={!chosen}
                  >
                    Submit
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

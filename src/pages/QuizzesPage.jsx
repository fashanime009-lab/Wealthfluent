import { useEffect, useMemo, useState } from "react";
import { fetchNews } from "../services/newsService";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Loader2,
  RefreshCw,
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
    <main className="min-h-screen bg-[#f3f7fc] text-slate-950">
      

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
              <Sparkles size={14} />
              API Generated
            </div>
            <h1 className="mt-5 text-5xl font-black tracking-tight">View All Quizzes</h1>
            <p className="mt-3 max-w-3xl text-slate-500">
              Questions are generated from live finance and business headlines, so the quiz keeps changing without manual updates.
            </p>
          </div>

          <aside className="rounded-xl bg-[#061225] p-6 text-white">
            <div className="flex items-center gap-3">
              <Bot className="text-blue-300" size={28} />
              <div>
                <h2 className="text-xl font-black">FinQuiz Score</h2>
                <p className="text-sm text-slate-400">
                  {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "Connecting"}
                </p>
              </div>
            </div>
            <div className="mt-7 text-5xl font-black">{score}/{answeredCount || 0}</div>
            <p className="mt-3 text-sm text-slate-400">Answer more questions to improve your score.</p>
          </aside>
        </div>

        {error && <p className="mt-6 rounded-md bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">{error}</p>}

        {loading && (
          <div className="mt-10 flex items-center justify-center gap-3 text-sm font-semibold text-slate-500">
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
              <article key={item.id} className="rounded-xl bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,.08)] ring-1 ring-slate-100">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">Question {index + 1}</span>
                  <span className="text-xs font-semibold text-slate-400">{item.source}</span>
                </div>
                <h2 className="mt-5 text-xl font-black leading-snug">{item.question}</h2>
                <div className="mt-6 space-y-3">
                  {item.options.map((option) => {
                    const active = chosen === option;
                    const correctStyle = isSubmitted && option === item.answer;
                    const wrongStyle = isSubmitted && active && option !== item.answer;

                    return (
                      <button
                        key={option}
                        onClick={() => chooseAnswer(item.id, option)}
                        className={`flex w-full items-center justify-between rounded-md border px-4 py-3 text-left text-sm font-semibold transition ${
                          correctStyle
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : wrongStyle
                              ? "border-red-300 bg-red-50 text-red-700"
                              : active
                                ? "border-blue-300 bg-blue-50 text-blue-700"
                                : "border-slate-200 bg-white text-slate-600 hover:border-blue-200"
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
                  <p className={`mt-5 text-sm font-semibold ${isCorrect ? "text-emerald-600" : "text-red-600"}`}>
                    {isCorrect ? "Correct." : "Not quite."} {item.explanation}
                  </p>
                )}
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => chooseAnswer(item.id, "")}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-500"
                  >
                    <RotateCcw size={15} />
                    Reset
                  </button>
                  <button
                    onClick={() => submitAnswer(item.id)}
                    className="rounded-md bg-blue-500 px-5 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
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

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { saveResult } from "@/utils/savedResults";

/**
 * The light-touch return-visit prompt rendered right after a calculator's
 * or verdict's headline result: a one-click, no-account "save this result"
 * (localStorage only) and a one-line newsletter signup. Shown by
 * CalcResultPanel and VerdictResult, so it appears after every tool's
 * result without each of the 30+ pages needing to render it themselves.
 */
export default function PostResultPrompt({ label, value, route }) {
  const [saved, setSaved] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSave = () => {
    if (saved) return;
    saveResult({ label, value, route });
    setSaved(true);
    trackEvent("save_result", { route });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@") || submitting) return;
    setSubmitting(true);
    fetch(import.meta.env.VITE_NEWSLETTER_ENDPOINT || "/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSubscribed(true);
          setEmail("");
          trackEvent("newsletter_signup", { source: "post_result" });
        }
      })
      .catch(() => {})
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="flex flex-col gap-3 border border-[#111814]/12 bg-[#ffffff] px-5 py-4 dark:border-[#eef1ec]/12 dark:bg-[#0b1210] sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={handleSave}
        className={`flex flex-shrink-0 items-center gap-1.5 text-[13px] font-semibold transition ${
          saved
            ? "text-[#047857] dark:text-[#34d399]"
            : "text-[#111814]/70 hover:text-[#111814] dark:text-[#eef1ec]/70 dark:hover:text-[#eef1ec]"
        }`}
      >
        {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
        {saved ? "Saved to this browser" : "Save this result"}
      </button>

      {subscribed ? (
        <span className="text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">
          Subscribed — one lesson a week, no spam.
        </span>
      ) : (
        <form onSubmit={handleSubscribe} className="flex min-w-0 items-center gap-2">
          <span className="hidden flex-shrink-0 text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55 sm:inline">
            Get one money lesson a week
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="min-w-0 flex-1 border-b border-[#111814]/25 bg-transparent px-1 py-1 text-[13px] text-[#111814] outline-none focus:border-[#047857] dark:border-[#eef1ec]/25 dark:text-[#eef1ec] dark:focus:border-[#34d399] sm:w-[180px] sm:flex-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex-shrink-0 text-[13px] font-semibold text-[#047857] disabled:opacity-50 dark:text-[#34d399]"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}

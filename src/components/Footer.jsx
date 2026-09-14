import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Calculators", to: "/calculators" },
      { label: "Verdict", to: "/verdict" },
      { label: "Goals", to: "/goals" },
      { label: "Insights", to: "/insights" },
      { label: "Tools", to: "/tools" },
      { label: "News", to: "/news" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Quizzes", to: "/quizzes" },
      { label: "Guides", to: "/learn" },
      { label: "FIRE Planning", to: "/fire-calculator" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Why FINAIW", to: "/about" },
      { label: "Contact us", to: "/contact" },
      { label: "Settings", to: "/settings" },
      { label: "Help", to: "/help" },
      { label: "Feedback", to: "/feedback" },
      { label: "Sitemap", to: "/sitemap" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", to: "/privacy-policy" },
      { label: "Data disclaimer", to: "/disclaimer" },
      { label: "Terms of service", to: "/terms-of-service" },
      { label: "Privacy dashboard", to: "/settings#privacy-data" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const subscribe = (e) => {
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
        }
      })
      .catch(() => {})
      .finally(() => setSubmitting(false));
  };

  const share = async () => {
    const shareData = {
      title: "FINAIW",
      text: "Free finance calculators, investment tools, live market news, and practical insights.",
      url: window.location.origin,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Website link copied to clipboard!");
      }
    } catch {
      /* share cancelled */
    }
  };

  const manageCookies = () => {
    localStorage.removeItem("finaiw-cookie-consent");
    window.location.reload();
  };

  return (
    <footer className="mt-8 bg-[#0e1512] text-[#eef1ec]">
      <div className="mx-auto max-w-[1240px] px-5 pb-8 pt-14 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 border-b border-[#eef1ec]/10 pb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-[20px] font-bold text-[#eef1ec]">Sharper money decisions, every Sunday.</h3>
            <p className="mt-1.5 max-w-md text-[13.5px] leading-6 text-[#eef1ec]/50">
              Market updates and new calculators — straight to your inbox, no spam.
            </p>
          </div>
          <form onSubmit={subscribe} className="flex w-full max-w-sm flex-shrink-0 items-center gap-2 border-b border-[#eef1ec]/25 pb-1.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#eef1ec] placeholder:text-[#eef1ec]/35 outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="flex-shrink-0 text-[13px] font-semibold text-[#34d399] disabled:opacity-50"
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </form>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <Logo size="lg" onDark taglineVisibility="always" />
            </Link>
            <p className="mt-5 max-w-sm text-[13.5px] leading-6 text-[#eef1ec]/50">
              Calculators, verdicts, goal tracking and learning — free, and built to help you decide
              with clarity.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              <button
                type="button"
                onClick={share}
                className="text-[12.5px] font-semibold text-[#eef1ec]/50 underline decoration-[#eef1ec]/25 underline-offset-4 hover:text-[#eef1ec]/80"
              >
                Share FINAIW
              </button>
              <button
                type="button"
                onClick={manageCookies}
                className="text-[12.5px] font-semibold text-[#eef1ec]/50 underline decoration-[#eef1ec]/25 underline-offset-4 hover:text-[#eef1ec]/80"
              >
                Cookie preferences
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h4 className="text-[12.5px] font-semibold text-[#eef1ec]/40">{column.title}</h4>
                <ul className="mt-3.5 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="text-[13.5px] font-medium text-[#eef1ec]/75 transition hover:text-[#eef1ec]">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#eef1ec]/10 pt-6 text-[12.5px] font-medium text-[#eef1ec]/40 sm:flex-row">
          <p>© {new Date().getFullYear()} FINAIW. All rights reserved.</p>
          <p>Your numbers stay on your device — 100% free, no signup.</p>
        </div>
      </div>
    </footer>
  );
}

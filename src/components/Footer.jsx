import { Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowRight,
  Share2,
  ShieldCheck,
  Sparkles,
  Mail,
  Settings as SettingsIcon,
  Cookie,
} from "lucide-react";
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
      { label: "Contact Us", to: "/contact" },
      { label: "Settings", to: "/settings" },
      { label: "Help", to: "/help" },
      { label: "Feedback", to: "/feedback" },
      { label: "Sitemap", to: "/sitemap" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Data Disclaimer", to: "/disclaimer" },
      { label: "Terms of Service", to: "/terms-of-service" },
      { label: "Privacy Dashboard", to: "/settings#privacy-data" },
    ],
  },
];

const trustBadges = [
  { icon: ShieldCheck, label: "Your data stays on your device" },
  { icon: Sparkles, label: "100% free, no signup" },
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
    <footer className="relative mt-8 overflow-hidden bg-[#050b16] text-white">
      {/* Ambient glow accents */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-sky-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

      <div className="relative mx-auto max-w-[1560px] px-5 pb-8 pt-16 sm:px-8 lg:px-10">
        {/* Top: Newsletter banner */}
        <div className="flex flex-col items-start justify-between gap-8 rounded-[28px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8 ring-1 ring-white/10 sm:flex-row sm:items-center sm:p-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] font-bold text-emerald-300 ring-1 ring-emerald-400/20">
              <Mail size={12} /> Weekly newsletter
            </div>
            <h3 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-[28px]">
              Sharper money decisions, every Sunday.
            </h3>
            <p className="mt-2 max-w-md text-[14px] font-medium leading-6 text-slate-400">
              Market updates, new calculators and practical investing ideas — straight to your inbox, no spam.
            </p>
          </div>
          <form
            onSubmit={subscribe}
            className="flex w-full max-w-md flex-shrink-0 items-center overflow-hidden rounded-2xl bg-white/[0.06] p-1.5 ring-1 ring-white/15 focus-within:ring-emerald-400/50"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[13px] font-semibold text-white placeholder:text-slate-500 outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              className="flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-3 text-[13px] font-black text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {subscribed ? "Subscribed ✓" : "Subscribe"}
              {!subscribed && <ArrowRight size={15} />}
            </button>
          </form>
        </div>

        {/* Middle: Brand + link columns */}
        <div className="mt-14 grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <Logo size="lg" onDark taglineVisibility="always" />
            </Link>
            <p className="mt-5 max-w-sm text-[13.5px] font-medium leading-6 text-slate-400">
              A personal finance operating system — calculators, verdicts, goal tracking and
              learning, built to help you decide with clarity.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <span
                    key={badge.label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1.5 text-[11.5px] font-bold text-slate-300 ring-1 ring-white/10"
                  >
                    <Icon size={13} className="text-emerald-400" />
                    {badge.label}
                  </span>
                );
              })}
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              <button
                onClick={share}
                aria-label="Share FINAIW"
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2.5 text-[12.5px] font-bold text-slate-300 ring-1 ring-white/10 transition hover:bg-white/[0.1] hover:text-white"
              >
                <Share2 size={14} /> Share FINAIW
              </button>
              <Link
                to="/settings"
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2.5 text-[12.5px] font-bold text-slate-300 ring-1 ring-white/10 transition hover:bg-white/[0.1] hover:text-white"
              >
                <SettingsIcon size={14} /> Settings
              </Link>
              <button
                onClick={manageCookies}
                aria-label="Manage cookie preferences"
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2.5 text-[12.5px] font-bold text-slate-300 ring-1 ring-white/10 transition hover:bg-white/[0.1] hover:text-white"
              >
                <Cookie size={14} /> Cookie Preferences
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h4 className="text-[12px] font-black uppercase tracking-[0.08em] text-slate-500">
                  {column.title}
                </h4>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-[13.5px] font-semibold text-slate-300 transition hover:text-emerald-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-[12.5px] font-semibold text-slate-500">
            © {new Date().getFullYear()} FINAIW. All rights reserved.
          </p>
          <p className="text-[12.5px] font-semibold text-slate-500">
            Made with <span className="text-rose-500">♥</span> in India
          </p>
        </div>
      </div>
    </footer>
  );
}

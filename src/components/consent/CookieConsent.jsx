import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, X, ChevronDown, Info } from "lucide-react";

const STORAGE_KEY = "finaiw-cookie-consent";

// Loads (or removes) the AdSense script based on consent. This is the ONLY
// thing on the whole site that actually sets a cookie — everything else
// FINAIW remembers about you (financial profile, goals, streak, theme,
// currency) is localStorage: first-party, device-only, never sent to us or
// anyone else, and not something ad-consent rules apply to. Keeping that
// distinction accurate is the whole point of this component.
function setAdsenseEnabled(enabled) {
  const existing = document.getElementById("adsbygoogle-script");
  if (enabled && !existing) {
    const script = document.createElement("script");
    script.id = "adsbygoogle-script";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX";
    document.head.appendChild(script);
  }
  // Note: once Google's script has loaded, it may have already set its own
  // cookies for that session. There's no supported client-side API to force
  // those out immediately on decline; the reliable guarantee is exactly
  // what this file already does — never inject the script unless
  // `enabled` is true, so a decline means the cookies are never set at all
  // on any later visit.
}

// Reads whatever's in localStorage and normalizes it to the current shape,
// so an old visitor's plain "accepted"/"declined" string (from before this
// was categorized) still works instead of re-showing the banner needlessly.
function readStoredConsent() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  if (raw === "accepted") return { advertising: true };
  if (raw === "declined") return { advertising: false };
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed?.advertising === "boolean" ? parsed : null;
  } catch {
    return null;
  }
}

export default function CookieConsent() {
  const [consent, setConsent] = useState(() => readStoredConsent());
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draftAdvertising, setDraftAdvertising] = useState(true);

  useEffect(() => {
    if (consent) {
      setAdsenseEnabled(consent.advertising === true);
      return undefined;
    }
    // Small delay so it doesn't compete with the initial page paint.
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = (advertising) => {
    const value = { advertising, decidedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setConsent(value);
    setAdsenseEnabled(advertising);
    setVisible(false);
    setExpanded(false);
  };

  if (consent || !visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-5">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,.16)] dark:border-white/10 dark:bg-slate-900">
        <div className="relative flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center">
          <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            <Cookie size={19} />
          </span>

          <div className="flex-1">
            <p className="text-[13px] leading-6 text-slate-600 dark:text-slate-300">
              FINAIW itself doesn't set tracking cookies. Your financial profile, goals and
              preferences are saved only in your browser's local storage and never sent anywhere —
              see below for exactly what that means. The one thing that <em>does</em> use real
              cookies is advertising, which is what keeps the site free.{" "}
              <Link to="/privacy-policy" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
                Privacy Policy
              </Link>
            </p>
            <button
              onClick={() => {
                setDraftAdvertising(true);
                setExpanded((v) => !v);
              }}
              className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              {expanded ? "Hide details" : "See exactly what's stored, and choose"}
              <ChevronDown size={14} className={`transition ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>

          <div className="flex w-full flex-shrink-0 gap-2 sm:w-auto">
            <button
              onClick={() => save(false)}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-[13px] font-bold text-slate-600 transition hover:bg-slate-50 sm:flex-none dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
            >
              Decline
            </button>
            <button
              onClick={() => save(true)}
              className="flex-1 rounded-xl bg-emerald-800 px-4 py-2.5 text-[13px] font-black text-white transition hover:bg-emerald-900 sm:flex-none"
            >
              Accept
            </button>
          </div>

          <button
            onClick={() => save(false)}
            aria-label="Dismiss"
            className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 sm:hidden dark:hover:bg-white/10"
          >
            <X size={15} />
          </button>
        </div>

        {expanded && (
          <div className="space-y-3 border-t border-slate-100 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
            {/* Necessary — this is genuinely not a cookie, and genuinely
                can't be turned off without breaking the product, so it's
                shown as always-on rather than as a fake toggle. */}
            <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200/70 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
              <div className="flex gap-3">
                <Info size={16} className="mt-0.5 flex-shrink-0 text-slate-400" />
                <div>
                  <p className="text-[13px] font-black text-slate-900 dark:text-white">
                    Local storage (not a cookie) — always on
                  </p>
                  <p className="mt-1 text-[12.5px] leading-5 text-slate-500 dark:text-slate-400">
                    Your financial profile, goals, learning streak, calculator history, and
                    display preferences (theme, currency) are saved on this device only, so the
                    app remembers them between visits. Nothing is transmitted to FINAIW's servers
                    or any third party — you can verify or clear it anytime from{" "}
                    <Link to="/settings" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
                      Settings
                    </Link>
                    . This isn't part of cookie consent rules and can't be meaningfully "declined"
                    without breaking the calculators and dashboard themselves.
                  </p>
                </div>
              </div>
              <span className="mt-1 flex-shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-400 dark:bg-white/10 dark:text-slate-500">
                Always on
              </span>
            </div>

            {/* Advertising — the one real, optional cookie category. */}
            <div className="flex items-start justify-between gap-4 rounded-xl border border-slate-200/70 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
              <div className="flex gap-3">
                <Cookie size={16} className="mt-0.5 flex-shrink-0 text-slate-400" />
                <div>
                  <p className="text-[13px] font-black text-slate-900 dark:text-white">
                    Advertising cookies (Google AdSense)
                  </p>
                  <p className="mt-1 text-[12.5px] leading-5 text-slate-500 dark:text-slate-400">
                    If enabled, Google AdSense sets cookies to show ads and measure their
                    performance — this is what keeps every calculator on FINAIW free. If you turn
                    this off, no ad cookies are set and every tool on the site still works exactly
                    the same; you just won't see ads.
                  </p>
                </div>
              </div>
              <button
                role="switch"
                aria-checked={draftAdvertising}
                onClick={() => setDraftAdvertising((v) => !v)}
                className={`relative mt-1 h-6 w-11 flex-shrink-0 rounded-full transition ${
                  draftAdvertising ? "bg-emerald-600" : "bg-slate-300 dark:bg-white/15"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    draftAdvertising ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => save(draftAdvertising)}
                className="rounded-xl bg-emerald-800 px-5 py-2.5 text-[13px] font-black text-white transition hover:bg-emerald-900"
              >
                Save preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

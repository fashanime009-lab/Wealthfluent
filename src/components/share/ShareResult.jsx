import { useState } from "react";
import { Share2, Download, Link2, MessageCircle, Check } from "lucide-react";
import { renderShareCard, downloadBlob } from "@/utils/shareCard";
import { trackEvent } from "@/lib/analytics";

const buttonClass =
  "inline-flex items-center gap-2 border border-[#111814]/20 px-4 py-2.5 text-[13px] font-semibold text-[#111814]/80 transition hover:border-[#111814]/35 hover:text-[#111814] dark:border-[#eef1ec]/20 dark:text-[#eef1ec]/80 dark:hover:border-[#eef1ec]/35 dark:hover:text-[#eef1ec]";

/**
 * The share/download UI for a calculated result — reusable across any page
 * that has a single shareable outcome to show off. Built for the Global
 * Net Worth Percentile page first; the verdict pages (rent-vs-buy,
 * debt-vs-invest, lease-vs-buy-car) are meant to use this next, sharing
 * the verdict itself (e.g. "Renting wins by ₹40L over 10 years" as text,
 * never the visitor's actual rent/price/income inputs).
 *
 * The caller owns all copy and the card's visual content — this component
 * only owns the mechanics: rendering + downloading the PNG, native share,
 * and the WhatsApp/X/Reddit/copy-link fallbacks, all wired to the same
 * consent-gated GA4 events.
 *
 * Props:
 *   shareUrl        absolute URL to share/copy — a link-preview-friendly
 *                    stub (server-rendered OG tags), not the raw SPA route
 *   shareText        text for WhatsApp/X/Reddit share intents
 *   drawCard(ctx, {width, height})  renders the downloadable PNG
 *   fileName          download filename, e.g. "finaiw-net-worth-percentile.png"
 *   analyticsContext  short string identifying which tool this is, added
 *                      to every GA4 event so tools can be told apart later
 */
export default function ShareResult({ shareUrl, shareText, drawCard, fileName, analyticsContext }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const track = (method) => trackEvent("share_click", { method, context: analyticsContext });

  const handleDownload = async () => {
    setError("");
    setDownloading(true);
    try {
      const blob = await renderShareCard(drawCard);
      downloadBlob(blob, fileName);
      trackEvent("card_download", { context: analyticsContext });
    } catch {
      setError("Couldn't generate the image on this device — try the WhatsApp/X/Reddit links below instead.");
    } finally {
      setDownloading(false);
    }
  };

  const handleNativeShare = async () => {
    track("native");
    try {
      const shareData = { title: shareText, text: shareText, url: shareUrl };
      // Attach the card image itself when the platform supports sharing
      // files (most mobile browsers); fall back to a text+link share.
      try {
        const blob = await renderShareCard(drawCard);
        const file = new File([blob], fileName, { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ ...shareData, files: [file] });
          return;
        }
      } catch {
        // Card render failed or files aren't shareable here — fall through
        // to a plain text+link share rather than failing the whole action.
      }
      await navigator.share(shareData);
    } catch {
      // AbortError (user cancelled) and anything else both just mean
      // nothing happened — no error state needed for a share sheet.
    }
  };

  const handleCopyLink = async () => {
    track("copy_link");
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Clipboard API unavailable/blocked — a manual, offscreen textarea
      // fallback so the button still works in older/locked-down browsers.
      const el = document.createElement("textarea");
      el.value = shareUrl;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      try {
        document.execCommand("copy");
      } catch {
        // Nothing more we can do — the visitor can still select the link
        // text themselves from wherever it's displayed.
      }
      el.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;

  return (
    <div className="border border-[#111814]/12 bg-[#ffffff] p-6 dark:border-[#eef1ec]/12 dark:bg-[#0b1210]">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-[#111814]/60 dark:text-[#eef1ec]/50">
        Share your result
      </p>
      <p className="mt-1.5 text-[12.5px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
        The link and card share your percentile only — never the amount you entered.
      </p>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {typeof navigator !== "undefined" && navigator.share && (
          <button type="button" onClick={handleNativeShare} className={buttonClass}>
            <Share2 size={15} />
            Share
          </button>
        )}
        <button type="button" onClick={handleDownload} disabled={downloading} className={`${buttonClass} disabled:opacity-50`}>
          <Download size={15} />
          {downloading ? "Preparing…" : "Download card"}
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("whatsapp")}
          className={buttonClass}
        >
          <MessageCircle size={15} />
          WhatsApp
        </a>
        <a href={xUrl} target="_blank" rel="noreferrer" onClick={() => track("x")} className={buttonClass}>
          X
        </a>
        <a href={redditUrl} target="_blank" rel="noreferrer" onClick={() => track("reddit")} className={buttonClass}>
          Reddit
        </a>
        <button type="button" onClick={handleCopyLink} className={buttonClass}>
          {copied ? <Check size={15} /> : <Link2 size={15} />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>

      {error && <p className="mt-3 text-[12.5px] text-amber-800 dark:text-amber-400">{error}</p>}
    </div>
  );
}

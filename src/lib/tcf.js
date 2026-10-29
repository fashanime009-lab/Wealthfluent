// Bridges Google's own "European regulations" consent message (IAB TCF v2,
// exposed globally as window.__tcfapi once Google's script decides a
// visitor is in the EEA, UK, or Switzerland) into this site's existing
// Consent Mode v2 signals — so an in-scope visitor sees Google's message
// instead of a second, redundant banner from CookieConsent.jsx, while a
// visitor outside that scope (where __tcfapi either never appears, or
// reports gdprApplies: false) still gets this site's own banner exactly
// as before.
//
// Purpose 1 ("Store and/or access information on a device") is used below
// as the proxy for both ad_storage and analytics_storage — it's the TCF
// purpose that gates on-device storage generally, and is the baseline
// every vendor (ad or analytics) requires regardless of their other,
// more specific purposes.

import { updateAdConsent, updateAnalyticsConsent } from "./analytics";

function applyFromTcData(tcData) {
  const purpose1 = tcData?.purpose?.consents?.[1] === true;
  updateAdConsent(purpose1);
  updateAnalyticsConsent(purpose1);
}

// Resolves once it's known whether Google's TCF-based message applies to
// this visitor. Polls briefly for __tcfapi (Google's script loads async),
// then asks it directly whether GDPR applies rather than trusting the
// function's mere presence — some CMP setups expose the API globally even
// for out-of-scope visitors, just reporting gdprApplies: false, which
// must still fall back to this site's own banner.
//
// The same registered listener keeps firing on later TCF events (e.g. the
// visitor reopens Google's message and changes their choice), applying
// the updated decision — the promise just doesn't re-resolve after its
// first settle, which is harmless.
export function resolveTcfScope(timeoutMs = 1200) {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    let settled = false;
    const finish = (applies) => {
      if (settled) return;
      settled = true;
      resolve(applies);
    };

    const giveUp = setTimeout(() => finish(false), timeoutMs);

    const poll = setInterval(() => {
      if (typeof window.__tcfapi !== "function") return;
      clearInterval(poll);
      window.__tcfapi("addEventListener", 2, (tcData, success) => {
        if (!success) {
          finish(false);
          return;
        }
        const applies = tcData.gdprApplies === true;
        clearTimeout(giveUp);
        finish(applies);
        if (applies && (tcData.eventStatus === "tcloaded" || tcData.eventStatus === "useractioncomplete")) {
          applyFromTcData(tcData);
        }
      });
    }, 100);
  });
}

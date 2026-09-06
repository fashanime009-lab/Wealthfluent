// Escapes user-supplied text before it's interpolated into an HTML email
// body. Without this, a submitted name/message containing HTML (e.g.
// "<img src=x onerror=...>" or a fake "click here to verify your bank
// account" link) would render as live HTML in the email the site owner
// (or, for auto-replies, the visitor) opens — a real injection risk for
// any form that builds email HTML from request-body strings.
export function escapeHtml(value) {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// A standard, reasonably strict email pattern — rejects the kind of
// "technically no @ or whitespace but full of HTML" strings that a naive
// regex like /^[^\s@]+@[^\s@]+\.[^\s@]+$/ would otherwise accept.
const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(value) {
  return typeof value === "string" && value.length <= 254 && EMAIL_RE.test(value);
}

// Trims and hard-caps a string's length server-side. Client-side
// maxLength attributes are a UX nicety only — anyone can call the API
// directly and bypass them, so every field needs a real limit here too.
export function cleanText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

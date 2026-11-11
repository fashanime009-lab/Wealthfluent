import { Resend } from "resend";

let client;

// Created on first use rather than at import: Cloudflare runs a Worker's
// top-level code when it's uploaded, before its secrets are available,
// and Resend's constructor throws without an API key. Lazily, a missing
// key only fails the request that needs email, inside its own try/catch.
export function getResend() {
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

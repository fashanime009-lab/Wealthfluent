# Growing the lesson library — no API, no cost

This replaces the earlier API-automation idea. There's no key, no bill, no
GitHub Action here — just two small changes that make adding lessons fast
when you do it, and a rotation that doesn't feel stale between batches.

## What changed
- `src/data/lessons.js` now has **25 lessons** (was 7) — about 3.5 weeks
  before the rotation would repeat, plus it now reshuffles once a year
  instead of marching through the same fixed order forever.
- `scripts/new-lessons-draft.txt` — a plain-text template.
- `scripts/add-lesson-from-draft.mjs` — parses that template and appends
  properly formatted lessons to `lessons.js`. Pure text processing, no
  network call.

## How to add more lessons whenever you're running low
1. Open any Claude chat (claude.ai — the one you already use, no API key
   needed) and ask for a batch, e.g.:
   > "Write 6 FINAIW-style personal finance lessons on: tax-saving
   > instruments, SWP, step-up SIPs, loan against mutual funds, ULIPs,
   > credit card rewards. Use this exact format:" — then paste the contents
   > of `scripts/new-lessons-draft.txt` as the format to follow.
2. Copy the reply into `scripts/new-lessons-draft.txt` (replacing the
   example block, keeping the `=====` separators between lessons).
3. Run:
   ```bash
   npm run add-lessons
   ```
4. It appends each valid lesson to `lessons.js`, skips anything malformed
   (with a warning telling you which field was missing), and resets the
   draft file so it's ready for next time.
5. Check `git diff`, commit, push. Vercel/Netlify auto-deploys as usual.

## Format reference
Each lesson block needs `Title`, `Category`, `ReadTime`, `Summary`,
`ToolLabel`, `ToolTo`, and a `Body:` section with paragraphs separated by a
line containing only `###`. Blocks are separated by a line of five equals
signs (`=====`). See `scripts/new-lessons-draft.txt` for the exact template.

## Valid `ToolTo` links (so nothing points to a broken page)
`/sip-calculator`, `/emi-calculator`, `/fd-calculator`, `/cagr-calculator`,
`/retirement-calculator`, `/emergency-fund-calculator`,
`/inflation-calculator`, `/fire-calculator`, `/networth-calculator`,
`/verdict/debt-vs-invest`, `/verdict/rent-vs-buy`,
`/verdict/insurance-need`, `/calculators`.

## Total cost
₹0. This is plain-text formatting running on your own machine — the only
"cost" is however long you spend chatting to get the next batch of drafts,
whenever you feel like doing it.

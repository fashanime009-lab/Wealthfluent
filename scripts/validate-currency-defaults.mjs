// Two checks, run on every build (via the "prebuild" npm script):
//
// 1. Currency coverage — fails the build if any currency Settings offers
//    is missing an entry in ASSUMPTIONS or DEFAULTS, so a newly added
//    currency can't silently start falling back to FALLBACK without
//    anyone noticing.
//
// 2. Slider-bounds coverage — REPORTS (does not fail the build) every
//    hand-picked default that falls outside the min/max/step of the
//    slider it actually loads into (see src/data/calculatorFieldBounds.js).
//    Kept non-fatal for now: these are real bugs, but whether to fix the
//    default or the slider's own range is a per-field judgment call, not
//    something this script should force blind.
import { validateCurrencyCoverage, defaultFor, assumptionsFor } from "../src/data/calculatorDefaults.js";
import { FIELD_BOUNDS } from "../src/data/calculatorFieldBounds.js";
import { currencies } from "../src/data/currencies.js";

const coverageProblems = validateCurrencyCoverage();

if (coverageProblems.length > 0) {
  console.error(`Currency defaults validation failed — ${coverageProblems.length} problem(s):\n`);
  for (const p of coverageProblems) console.error(`  - ${p}`);
  console.error("\nFix src/data/calculatorDefaults.js before building.");
  process.exit(1);
}

console.log("Currency defaults validation passed — every supported currency has a complete entry.");

const EPS = 1e-6;
const boundsProblems = [];
const codes = currencies.map((c) => c.code);

for (const [calcKey, fields] of Object.entries(FIELD_BOUNDS)) {
  for (const code of codes) {
    const resolved = {};
    for (const [fieldKey, spec] of Object.entries(fields)) {
      resolved[fieldKey] =
        spec.source === "assumption" ? assumptionsFor(code)[spec.assumptionKey] : defaultFor(calcKey, fieldKey, code);
    }

    for (const [fieldKey, spec] of Object.entries(fields)) {
      const value = resolved[fieldKey];
      const bounds = typeof spec.bounds === "function" ? spec.bounds(code, resolved) : spec.bounds;
      const { min, max, step } = bounds;

      if (value < min - EPS) {
        boundsProblems.push(`${calcKey}.${fieldKey} [${code}] = ${value} is BELOW min ${min}`);
      } else if (value > max + EPS) {
        boundsProblems.push(`${calcKey}.${fieldKey} [${code}] = ${value} is ABOVE max ${max}`);
      } else if (step) {
        const offset = (value - min) / step;
        if (Math.abs(offset - Math.round(offset)) > 1e-4) {
          boundsProblems.push(
            `${calcKey}.${fieldKey} [${code}] = ${value} does not align with step ${step} from min ${min}`
          );
        }
      }
    }
  }
}

if (boundsProblems.length > 0) {
  console.warn(`\nSlider-bounds check — ${boundsProblems.length} default(s) fall outside their field's own slider range or step:\n`);
  for (const p of boundsProblems) console.warn(`  - ${p}`);
} else {
  console.log("Slider-bounds check passed — every default fits its field's slider range and step.");
}

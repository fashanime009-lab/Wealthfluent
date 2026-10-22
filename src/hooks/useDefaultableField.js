import { useState, useRef, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";
import { defaultFor, assumptionsFor } from "@/data/calculatorDefaults";
import { boundsFor } from "@/data/calculatorFieldBounds";

// Returns [value, setValue] like useState, except the value starts at
// resolve(currency) and keeps tracking the current currency's value for as
// long as the user hasn't touched the field. The moment they call setValue
// (typing into the field), it's marked touched and switching currency in
// Settings never overwrites it again — only still-untouched fields follow
// a currency change. `resolve` is a plain function of the currency code,
// so it works for both a DEFAULTS lookup and an ASSUMPTIONS rate — see the
// two convenience wrappers below.
export function useDefaultableValue(resolve) {
  const { settings } = useSettings();
  const currency = settings.currency;
  const touched = useRef(false);
  const [value, setValueRaw] = useState(() => resolve(currency));

  useEffect(() => {
    if (!touched.current) {
      setValueRaw(resolve(currency));
    }
    // Only a currency change should re-run this — `resolve` is stable per
    // call site, not a reactive input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const setValue = (v) => {
    touched.current = true;
    setValueRaw(v);
  };

  return [value, setValue];
}

// Convenience wrapper for a plain per-calculator default from DEFAULTS.
export default function useDefaultableField(calculatorKey, field) {
  return useDefaultableValue((currency) => defaultFor(calculatorKey, field, currency));
}

// Convenience wrapper for a shared rate from ASSUMPTIONS — e.g.
// useAssumptionField("equityReturn") for a SIP/Lumpsum/etc return rate,
// "inflation" or "retirementReturn" for the other two.
export function useAssumptionField(assumptionKey) {
  return useDefaultableValue((currency) => assumptionsFor(currency)[assumptionKey]);
}

// For forms that hold several related fields in one state object (Home
// Affordability, Emergency Fund, FIRE, Wealth Age) instead of one useState
// per field. `fields` is an array of keys to pull from DEFAULTS[calculatorKey].
// Touched-tracking happens at the whole-object level, not per field — once
// the user edits any one of these interrelated numbers (e.g. property price
// in a home-affordability form), switching currency shouldn't silently move
// only the untouched fields and leave a mismatched mix; the whole form stops
// following currency changes together.
export function useDefaultableObject(calculatorKey, fields) {
  const buildFor = (currency) =>
    Object.fromEntries(fields.map((field) => [field, defaultFor(calculatorKey, field, currency)]));
  return useDefaultableValue(buildFor);
}

// Same idea, but for a form that mixes plain DEFAULTS fields with a shared
// ASSUMPTIONS rate (FIRE: age fields + monthlyExpenses/savings/investment
// from DEFAULTS, but expectedReturn/inflationRate from the shared block) —
// `resolveObject(currency)` builds the whole object itself, however it needs
// to for that calculator.
export function useDefaultableObjectCustom(resolveObject) {
  return useDefaultableValue(resolveObject);
}

// A field's slider/typed-input bounds for the current currency. Unlike the
// hooks above, this always tracks the current currency — a range is a
// property of the currency itself, not something a user "touches" and
// locks in, so there's no touched-ref here. `context` carries any already-
// resolved sibling field values a dynamic bound needs (e.g. Home
// Affordability's down payment is capped by that currency's own
// property-price value) — see calculatorFieldBounds.js.
export function useFieldBounds(calculatorKey, field, context) {
  const { settings } = useSettings();
  return boundsFor(calculatorKey, field, settings.currency, context);
}

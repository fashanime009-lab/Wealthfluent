// The verdict system's signal colors — shared by VerdictScale and
// VerdictResult so every comparison across the site reads the same way.
// Only two signal colors exist on purpose: green means the verdict is
// decisive, rust means it's close (or, for insurance, that there's a
// gap). Which side of a comparison wins is shown by position on the
// scale, never by color — color only ever encodes how confident the
// verdict is.
//
// The counter color is deliberately rust/brick (hue ~13-15°), not amber
// — it used to be amber (#b45309/#fbbf24), but once Retirement claimed
// ochre/tan (~42-46°) as a category color, the two were only ~10-15°
// apart and read as the same color at a glance. Rust sits ~27-32° from
// ochre on the wheel, so "this verdict is close" and "this is a
// retirement tool" no longer look like the same signal. See
// src/data/categoryColors.js for the category side of this.
export const TONE_COLOR = {
  go: { light: "#047857", dark: "#34d399" },
  caution: { light: "#9a3412", dark: "#d9552e" },
  stop: { light: "#9a3412", dark: "#d9552e" },
};

export const TONE_COPY = {
  go: "Clear verdict",
  caution: "Close call",
  stop: "Meaningful gap",
};

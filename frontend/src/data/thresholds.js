// Named thresholds mirror the `thresholds` dict from the backend's `main.py` CLI flow,
// so behavior stays identical for these six items. For any other scanned ingredient
// (the CLI never handled these), we fall back to a sensible default based on unit,
// so low-stock detection works generally rather than only for six hardcoded items.

export const NAMED_THRESHOLDS = {
  Tomato: 0.5,
  Rice: 1.0,
  Onion: 0.5,
  Milk: 1.0,
  Apples: 2.0,
  Bread: 1.0,
}

const UNIT_DEFAULTS = {
  kg: 0.4,
  g: 150,
  L: 0.5,
  ml: 200,
  piece: 2,
  packet: 1,
  dozen: 0.5,
}

export function getThresholdFor(name, unit) {
  if (Object.prototype.hasOwnProperty.call(NAMED_THRESHOLDS, name)) {
    return NAMED_THRESHOLDS[name]
  }
  return UNIT_DEFAULTS[unit] ?? 1
}

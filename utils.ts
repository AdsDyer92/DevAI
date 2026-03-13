export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function acresToHa(acres: number) {
  return acres * 0.404686
}

export function sqmToHa(sqm: number) {
  return sqm / 10000
}

export function round(value: number, dp = 0) {
  const p = 10 ** dp
  return Math.round(value * p) / p
}

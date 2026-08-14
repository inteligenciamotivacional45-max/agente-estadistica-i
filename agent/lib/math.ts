export function round(value: number, digits = 6): number {
  if (!Number.isFinite(value)) return value;
  const p = 10 ** digits;
  return Math.round(value * p) / p;
}

export function sorted(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

export function quantile(data: number[], p: number): number {
  const xs = sorted(data);
  if (xs.length === 1) return xs[0];
  const idx = (xs.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return xs[lo];
  return xs[lo] + (xs[hi] - xs[lo]) * (idx - lo);
}

export function sum(values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

export function mean(values: number[]): number {
  return sum(values) / values.length;
}

export function variance(values: number[], sample = true): number {
  const n = values.length;
  const m = mean(values);
  const ss = values.reduce((acc, v) => acc + (v - m) ** 2, 0);
  const denom = sample ? Math.max(n - 1, 1) : n;
  return ss / denom;
}

export function stdev(values: number[], sample = true): number {
  return Math.sqrt(variance(values, sample));
}

export function geometricMean(values: number[]): number {
  if (values.some((v) => v <= 0)) {
    throw new Error("La media geométrica requiere valores estrictamente positivos.");
  }
  return Math.exp(mean(values.map(Math.log)));
}

export function harmonicMean(values: number[]): number {
  if (values.some((v) => v === 0)) {
    throw new Error("La media armónica no está definida si hay ceros.");
  }
  return values.length / sum(values.map((v) => 1 / v));
}

export function modes(values: number[]): number[] {
  const freq = new Map<number, number>();
  for (const v of values) freq.set(v, (freq.get(v) ?? 0) + 1);
  const maxFreq = Math.max(...freq.values());
  if (maxFreq === 1) return [];
  return [...freq.entries()].filter(([, c]) => c === maxFreq).map(([v]) => v);
}

export function meanDeviation(values: number[]): number {
  const m = mean(values);
  return mean(values.map((v) => Math.abs(v - m)));
}

export function logFactorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error("El factorial requiere un entero no negativo.");
  }
  let s = 0;
  for (let i = 2; i <= n; i++) s += Math.log(i);
  return s;
}

export function factorial(n: number): number {
  if (n > 170) return Number.POSITIVE_INFINITY;
  return Math.round(Math.exp(logFactorial(n)));
}

export function permutations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  return Math.round(Math.exp(logFactorial(n) - logFactorial(n - k)));
}

export function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  return Math.round(Math.exp(logFactorial(n) - logFactorial(k) - logFactorial(n - k)));
}

/** Abramowitz & Stegun 7.1.26 */
export function erf(x: number): number {
  const sign = Math.sign(x) || 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y =
    1 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
}

export function normalCdf(x: number, mu = 0, sigma = 1): number {
  return 0.5 * (1 + erf((x - mu) / (sigma * Math.SQRT2)));
}

export function normalPdf(x: number, mu = 0, sigma = 1): number {
  const z = (x - mu) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

export function poissonPmf(k: number, lambda: number): number {
  if (k < 0 || !Number.isInteger(k)) return 0;
  return Math.exp(-lambda + k * Math.log(lambda) - logFactorial(k));
}

export function binomialPmf(k: number, n: number, p: number): number {
  if (k < 0 || k > n) return 0;
  return Math.exp(
    logFactorial(n) -
      logFactorial(k) -
      logFactorial(n - k) +
      k * Math.log(p) +
      (n - k) * Math.log(1 - p),
  );
}

export function geometricPmf(k: number, p: number): number {
  if (k < 1 || !Number.isInteger(k)) return 0;
  return p * (1 - p) ** (k - 1);
}

export function hypergeometricPmf(k: number, N: number, K: number, n: number): number {
  if (k < Math.max(0, n - (N - K)) || k > Math.min(n, K)) return 0;
  return (combinations(K, k) * combinations(N - K, n - k)) / combinations(N, n);
}

/** Lanczos approximation for ln Γ(z), z > 0 */
export function logGamma(z: number): number {
  if (z <= 0) throw new Error("logGamma requiere z > 0.");
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843697261163e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  }
  const g = 7;
  z -= 1;
  let x = p[0];
  for (let i = 1; i < p.length; i++) x += p[i] / (z + i);
  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

export function gammaPdf(x: number, shape: number, scale: number): number {
  if (x < 0) return 0;
  if (x === 0) return shape === 1 ? 1 / scale : 0;
  return Math.exp(
    (shape - 1) * Math.log(x) -
      x / scale -
      shape * Math.log(scale) -
      logGamma(shape),
  );
}

export function betaPdf(x: number, alpha: number, beta: number): number {
  if (x <= 0 || x >= 1) return 0;
  return Math.exp(
    (alpha - 1) * Math.log(x) +
      (beta - 1) * Math.log(1 - x) -
      logGamma(alpha) -
      logGamma(beta) +
      logGamma(alpha + beta),
  );
}

export function zCritical(alpha: number): number {
  const table: Record<string, number> = {
    "0.1": 1.644854,
    "0.05": 1.959964,
    "0.02": 2.326348,
    "0.01": 2.575829,
  };
  const key = String(alpha);
  if (table[key] !== undefined) return table[key];
  throw new Error("Usa α = 0.1, 0.05, 0.02 o 0.01 (bilateral).");
}

export function latexNum(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return String(value);
  const abs = Math.abs(value);
  if (abs !== 0 && (abs >= 1e6 || abs < 1e-4)) {
    const [coeff, exp] = value.toExponential(digits).split("e");
    return `${coeff} \\times 10^{${Number(exp)}}`;
  }
  const s = value.toFixed(digits).replace(/\.?0+$/, "");
  return s;
}

import { defineTool } from "eve/tools";
import { z } from "zod";
import {
  geometricMean,
  harmonicMean,
  latexNum,
  mean,
  meanDeviation,
  modes,
  quantile,
  round,
  sorted,
  stdev,
  variance,
} from "../lib/math";

export default defineTool({
  description:
    "Unidad 2: media aritmética, ponderada no, geométrica, armónica, mediana, moda, cuartiles/deciles/percentiles, rango, desviación media, s, CV y z. Serie de datos sin agrupar.",
  inputSchema: z.object({
    values: z.array(z.number()).min(1).describe("Muestra numérica"),
    sample: z
      .boolean()
      .default(true)
      .describe("true = s^2 con n-1; false = σ^2 con n"),
    weights: z
      .array(z.number())
      .optional()
      .describe("Pesos opcionales para media ponderada, mismo largo que values"),
  }),
  async execute({ values, sample, weights }) {
    const xs = sorted(values);
    const n = xs.length;
    const xbar = mean(xs);
    const s2 = variance(xs, sample);
    const s = Math.sqrt(s2);
    const me = quantile(xs, 0.5);
    const q1 = quantile(xs, 0.25);
    const q3 = quantile(xs, 0.75);
    const p10 = quantile(xs, 0.1);
    const p90 = quantile(xs, 0.9);
    const min = xs[0];
    const max = xs[n - 1];
    const mo = modes(xs);
    const md = meanDeviation(xs);

    let weighted: number | null = null;
    if (weights) {
      if (weights.length !== values.length) {
        throw new Error("weights debe tener la misma longitud que values.");
      }
      const wsum = weights.reduce((a, b) => a + b, 0);
      if (wsum === 0) throw new Error("La suma de pesos no puede ser 0.");
      weighted = values.reduce((acc, v, i) => acc + v * weights[i], 0) / wsum;
    }

    let g: number | null = null;
    let h: number | null = null;
    let geoError: string | undefined;
    let harmError: string | undefined;
    try {
      g = geometricMean(xs);
    } catch (e) {
      geoError = e instanceof Error ? e.message : String(e);
    }
    try {
      h = harmonicMean(xs);
    } catch (e) {
      harmError = e instanceof Error ? e.message : String(e);
    }

    const pearsonMode = 3 * me - 2 * xbar;
    const cv = xbar !== 0 ? s / xbar : null;
    const z = xs.map((v) => (s === 0 ? 0 : (v - xbar) / s));

    const L = latexNum;
    return {
      n,
      mean: round(xbar),
      weightedMean: weighted === null ? null : round(weighted),
      geometricMean: g === null ? null : round(g),
      harmonicMean: h === null ? null : round(h),
      median: round(me),
      modes: mo,
      pearsonEmpiricalMode: round(pearsonMode),
      min,
      max,
      range: round(max - min),
      meanDeviation: round(md),
      q1: round(q1),
      q3: round(q3),
      iqr: round(q3 - q1),
      semiInterquartileRange: round((q3 - q1) / 2),
      p10: round(p10),
      p90: round(p90),
      range10_90: round(p90 - p10),
      variance: round(s2),
      stdev: round(s),
      cv: cv === null ? null : round(cv),
      zScores: z.map((v) => round(v, 4)),
      sample,
      notes: [geoError, harmError].filter(Boolean),
      latex: {
        media: `\\bar{x} = ${L(xbar)}`,
        mediana: `\\mathrm{Me} = ${L(me)}`,
        varianza: `s^{2} = ${L(s2)}`,
        desviacion: `s = ${L(s)}`,
        cv: cv === null ? "\\mathrm{CV}\\text{ indefinido }(\\bar{x}=0)" : `\\mathrm{CV} = ${L(cv)}`,
        tipificada: `z_i = \\frac{x_i - ${L(xbar)}}{${L(s)}}`,
        pearson: `\\mathrm{Mo} \\approx 3\\,\\mathrm{Me}-2\\,\\bar{x} = ${L(pearsonMode)}`,
      },
    };
  },
});

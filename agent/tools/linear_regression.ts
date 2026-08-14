import { defineTool } from "eve/tools";
import { z } from "zod";
import { latexNum, mean, round } from "../lib/math";

export default defineTool({
  description:
    "Unidad 3: recta de mínimos cuadrados, r, r^2, error típico s_{y|x}, variación explicada y no explicada. Series x,y del mismo largo.",
  inputSchema: z.object({
    x: z.array(z.number()).min(3),
    y: z.array(z.number()).min(3),
  }),
  async execute({ x, y }) {
    if (x.length !== y.length) {
      throw new Error("x e y deben tener la misma longitud.");
    }
    const n = x.length;
    const xbar = mean(x);
    const ybar = mean(y);
    let sxx = 0;
    let syy = 0;
    let sxy = 0;
    for (let i = 0; i < n; i++) {
      const dx = x[i] - xbar;
      const dy = y[i] - ybar;
      sxx += dx * dx;
      syy += dy * dy;
      sxy += dx * dy;
    }
    if (sxx === 0) throw new Error("x es constante; no hay recta de regresión.");
    const b = sxy / sxx;
    const a = ybar - b * xbar;
    const r = syy === 0 ? 0 : sxy / Math.sqrt(sxx * syy);
    const r2 = r * r;
    const yhat = x.map((xi) => a + b * xi);
    const sse = y.reduce((acc, yi, i) => acc + (yi - yhat[i]) ** 2, 0);
    const sst = syy;
    const ssr = sst - sse;
    const see = Math.sqrt(sse / Math.max(n - 2, 1));

    const L = latexNum;
    return {
      n,
      intercept: round(a),
      slope: round(b),
      r: round(r, 6),
      r2: round(r2, 6),
      explainedVariation: round(ssr),
      unexplainedVariation: round(sse),
      totalVariation: round(sst),
      standardError: round(see),
      fitted: yhat.map((v) => round(v, 4)),
      residuals: y.map((yi, i) => round(yi - yhat[i], 4)),
      latex: {
        recta: `\\hat{y} = ${L(a)} + ${L(b)}x`,
        correlacion: `r = ${L(r, 4)}, \\quad r^{2} = ${L(r2, 4)}`,
        error: `s_{y\\mid x} = ${L(see)}`,
        descomposicion: `\\underbrace{${L(sst)}}_{\\mathrm{total}} = \\underbrace{${L(ssr)}}_{\\mathrm{explicada}} + \\underbrace{${L(sse)}}_{\\mathrm{residual}}`,
      },
    };
  },
});

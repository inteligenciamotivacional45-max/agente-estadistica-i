import { defineTool } from "eve/tools";
import { z } from "zod";
import { latexNum, round, zCritical } from "../lib/math";

export default defineTool({
  description:
    "Unidad 7: intervalos de confianza z para media (σ conocida), proporción, diferencia de medias y error probable. α = 0.1, 0.05, 0.02 o 0.01.",
  inputSchema: z.discriminatedUnion("kind", [
    z.object({
      kind: z.literal("media"),
      mean: z.number(),
      sigma: z.number().positive(),
      n: z.number().int().positive(),
      alpha: z.number().default(0.05),
    }),
    z.object({
      kind: z.literal("proporcion"),
      successes: z.number().int().nonnegative(),
      n: z.number().int().positive(),
      alpha: z.number().default(0.05),
    }),
    z.object({
      kind: z.literal("diferencia_medias"),
      mean1: z.number(),
      mean2: z.number(),
      sigma1: z.number().positive(),
      sigma2: z.number().positive(),
      n1: z.number().int().positive(),
      n2: z.number().int().positive(),
      alpha: z.number().default(0.05),
    }),
    z.object({
      kind: z.literal("error_probable"),
      sigma: z.number().positive(),
      n: z.number().int().positive(),
    }),
  ]),
  async execute(input) {
    const L = latexNum;
    if (input.kind === "error_probable") {
      const ep = 0.6745 * (input.sigma / Math.sqrt(input.n));
      return {
        kind: input.kind,
        errorProbable: round(ep),
        latex: `0.6745\\,\\frac{${L(input.sigma)}}{\\sqrt{${input.n}}}=${L(ep)}`,
      };
    }
    const z = zCritical(input.alpha);
    if (input.kind === "media") {
      const se = input.sigma / Math.sqrt(input.n);
      const half = z * se;
      const lo = input.mean - half;
      const hi = input.mean + half;
      return {
        kind: input.kind,
        z: round(z, 6),
        lower: round(lo),
        upper: round(hi),
        latex: `${L(input.mean)} \\pm ${L(z, 3)}\\,\\frac{${L(input.sigma)}}{\\sqrt{${input.n}}} = [${L(lo)},\\,${L(hi)}]`,
      };
    }
    if (input.kind === "proporcion") {
      const p = input.successes / input.n;
      const se = Math.sqrt((p * (1 - p)) / input.n);
      const half = z * se;
      return {
        kind: input.kind,
        pHat: round(p, 6),
        z: round(z, 6),
        lower: round(p - half, 6),
        upper: round(p + half, 6),
        latex: `${L(p)} \\pm ${L(z, 3)}\\sqrt{\\frac{${L(p)}(1-${L(p)})}{${input.n}}}`,
      };
    }
    const se = Math.sqrt(input.sigma1 ** 2 / input.n1 + input.sigma2 ** 2 / input.n2);
    const diff = input.mean1 - input.mean2;
    const half = z * se;
    return {
      kind: input.kind,
      difference: round(diff),
      z: round(z, 6),
      lower: round(diff - half),
      upper: round(diff + half),
      latex: `(${L(input.mean1)}-${L(input.mean2)}) \\pm ${L(z, 3)}\\sqrt{\\frac{${L(input.sigma1)}^2}{${input.n1}}+\\frac{${L(input.sigma2)}^2}{${input.n2}}}`,
    };
  },
});

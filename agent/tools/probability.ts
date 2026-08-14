import { defineTool } from "eve/tools";
import { z } from "zod";
import {
  combinations,
  factorial,
  latexNum,
  permutations,
  round,
} from "../lib/math";

export default defineTool({
  description:
    "Unidad 4: factorial, permutaciones, combinaciones, probabilidad clásica, condicional e independencia, y Bayes con hipótesis discretas.",
  inputSchema: z.discriminatedUnion("op", [
    z.object({
      op: z.literal("factorial"),
      n: z.number().int().nonnegative(),
    }),
    z.object({
      op: z.literal("permutaciones"),
      n: z.number().int().nonnegative(),
      k: z.number().int().nonnegative(),
    }),
    z.object({
      op: z.literal("combinaciones"),
      n: z.number().int().nonnegative(),
      k: z.number().int().nonnegative(),
    }),
    z.object({
      op: z.literal("clasica"),
      favorables: z.number().int().nonnegative(),
      totales: z.number().int().positive(),
    }),
    z.object({
      op: z.literal("condicional"),
      pA: z.number().min(0).max(1).optional(),
      pB: z.number().min(0).max(1),
      pAandB: z.number().min(0).max(1),
    }),
    z.object({
      op: z.literal("bayes"),
      prior: z.array(z.number().min(0)).min(2).describe("P(A_i)"),
      likelihood: z.array(z.number().min(0).max(1)).describe("P(B|A_i)"),
    }),
  ]),
  async execute(input) {
    const L = latexNum;
    switch (input.op) {
      case "factorial": {
        const value = factorial(input.n);
        return {
          op: input.op,
          value,
          latex: `${input.n}! = ${L(value, 0)}`,
        };
      }
      case "permutaciones": {
        const value = permutations(input.n, input.k);
        return {
          op: input.op,
          value,
          latex: `P(${input.n},${input.k}) = ${L(value, 0)}`,
        };
      }
      case "combinaciones": {
        const value = combinations(input.n, input.k);
        return {
          op: input.op,
          value,
          latex: `\\binom{${input.n}}{${input.k}} = ${L(value, 0)}`,
        };
      }
      case "clasica": {
        const p = input.favorables / input.totales;
        return {
          op: input.op,
          p: round(p, 8),
          latex: `P(A) = \\frac{${input.favorables}}{${input.totales}} = ${L(p)}`,
        };
      }
      case "condicional": {
        if (input.pB === 0) throw new Error("P(B) no puede ser 0.");
        const pAgivenB = input.pAandB / input.pB;
        const independent =
          input.pA === undefined ? null : Math.abs(input.pAandB - input.pA * input.pB) < 1e-12;
        return {
          op: input.op,
          pAgivenB: round(pAgivenB, 8),
          independent,
          latex: `P(A\\mid B) = \\frac{${L(input.pAandB)}}{${L(input.pB)}} = ${L(pAgivenB)}`,
        };
      }
      case "bayes": {
        if (input.prior.length !== input.likelihood.length) {
          throw new Error("prior y likelihood deben tener el mismo largo.");
        }
        const priorSum = input.prior.reduce((a, b) => a + b, 0);
        if (Math.abs(priorSum - 1) > 1e-6) {
          throw new Error("Las P(A_i) deben sumar 1.");
        }
        const joints = input.prior.map((p, i) => p * input.likelihood[i]);
        const pB = joints.reduce((a, b) => a + b, 0);
        if (pB === 0) throw new Error("P(B) resultó 0; revisa las verosimilitudes.");
        const posterior = joints.map((j) => j / pB);
        const terms = input.prior
          .map((p, i) => `${L(input.likelihood[i])}\\cdot ${L(p)}`)
          .join(" + ");
        return {
          op: input.op,
          pB: round(pB, 8),
          posterior: posterior.map((v) => round(v, 8)),
          latex: {
            evidencia: `P(B) = ${terms} = ${L(pB)}`,
            posterior: posterior
              .map((v, i) => `P(A_{${i + 1}}\\mid B) = ${L(v)}`)
              .join(", \\quad "),
          },
        };
      }
    }
  },
});

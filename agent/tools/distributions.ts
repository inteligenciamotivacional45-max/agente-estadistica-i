import { defineTool } from "eve/tools";
import { z } from "zod";
import {
  betaPdf,
  binomialPmf,
  gammaPdf,
  geometricPmf,
  hypergeometricPmf,
  latexNum,
  normalCdf,
  normalPdf,
  poissonPmf,
  round,
} from "../lib/math";

function binomialCdf(k: number, n: number, p: number): number {
  let s = 0;
  const kInt = Math.floor(k);
  for (let i = 0; i <= kInt; i++) s += binomialPmf(i, n, p);
  return s;
}

function poissonCdf(k: number, lambda: number): number {
  let s = 0;
  const kInt = Math.floor(k);
  for (let i = 0; i <= kInt; i++) s += poissonPmf(i, lambda);
  return s;
}

export default defineTool({
  description:
    "Unidades 5–6: evalúa binomial, hipergeométrica, Poisson, geométrica, normal, log-normal, uniforme, gamma y beta (pmf/pdf, cdf si aplica, media y varianza).",
  inputSchema: z.discriminatedUnion("family", [
    z.object({
      family: z.literal("binomial"),
      n: z.number().int().positive(),
      p: z.number().min(0).max(1),
      k: z.number().int().nonnegative(),
    }),
    z.object({
      family: z.literal("hipergeometrica"),
      N: z.number().int().positive(),
      K: z.number().int().nonnegative(),
      n: z.number().int().positive(),
      k: z.number().int().nonnegative(),
    }),
    z.object({
      family: z.literal("poisson"),
      lambda: z.number().positive(),
      k: z.number().int().nonnegative(),
    }),
    z.object({
      family: z.literal("geometrica"),
      p: z.number().gt(0).lte(1),
      k: z.number().int().positive().describe("Ensayos hasta el primer éxito"),
    }),
    z.object({
      family: z.literal("normal"),
      mu: z.number(),
      sigma: z.number().positive(),
      x: z.number(),
    }),
    z.object({
      family: z.literal("lognormal"),
      mu: z.number().describe("Media de ln X"),
      sigma: z.number().positive().describe("Desv. de ln X"),
      x: z.number().positive(),
    }),
    z.object({
      family: z.literal("uniforme"),
      a: z.number(),
      b: z.number(),
      x: z.number(),
    }),
    z.object({
      family: z.literal("gamma"),
      shape: z.number().positive(),
      scale: z.number().positive(),
      x: z.number().nonnegative(),
    }),
    z.object({
      family: z.literal("beta"),
      alpha: z.number().positive(),
      beta: z.number().positive(),
      x: z.number().gt(0).lt(1),
    }),
  ]),
  async execute(input) {
    const L = latexNum;
    switch (input.family) {
      case "binomial": {
        const pmf = binomialPmf(input.k, input.n, input.p);
        const cdf = binomialCdf(input.k, input.n, input.p);
        const mean = input.n * input.p;
        const variance = input.n * input.p * (1 - input.p);
        return {
          family: input.family,
          pmf: round(pmf, 8),
          cdf: round(cdf, 8),
          mean: round(mean),
          variance: round(variance),
          latex: `P(X=${input.k})=\\binom{${input.n}}{${input.k}}${L(input.p)}^{${input.k}}(1-${L(input.p)})^{${input.n - input.k}}=${L(pmf)}`,
        };
      }
      case "hipergeometrica": {
        const pmf = hypergeometricPmf(input.k, input.N, input.K, input.n);
        const mean = (input.n * input.K) / input.N;
        return {
          family: input.family,
          pmf: round(pmf, 8),
          mean: round(mean),
          latex: `P(X=${input.k})=\\dfrac{\\binom{${input.K}}{${input.k}}\\binom{${input.N - input.K}}{${input.n - input.k}}}{\\binom{${input.N}}{${input.n}}}=${L(pmf)}`,
        };
      }
      case "poisson": {
        const pmf = poissonPmf(input.k, input.lambda);
        return {
          family: input.family,
          pmf: round(pmf, 8),
          cdf: round(poissonCdf(input.k, input.lambda), 8),
          mean: input.lambda,
          variance: input.lambda,
          latex: `P(X=${input.k})=e^{-${L(input.lambda)}}\\frac{${L(input.lambda)}^{${input.k}}}{${input.k}!}=${L(pmf)}`,
        };
      }
      case "geometrica": {
        const pmf = geometricPmf(input.k, input.p);
        return {
          family: input.family,
          pmf: round(pmf, 8),
          mean: round(1 / input.p),
          variance: round((1 - input.p) / input.p ** 2),
          latex: `P(X=${input.k})=(1-${L(input.p)})^{${input.k - 1}}${L(input.p)}=${L(pmf)}`,
        };
      }
      case "normal": {
        const pdf = normalPdf(input.x, input.mu, input.sigma);
        const cdf = normalCdf(input.x, input.mu, input.sigma);
        const z = (input.x - input.mu) / input.sigma;
        return {
          family: input.family,
          pdf: round(pdf, 8),
          cdf: round(cdf, 8),
          z: round(z, 6),
          latex: `Z=\\frac{${L(input.x)}-${L(input.mu)}}{${L(input.sigma)}}=${L(z)},\\quad \\Phi(Z)=${L(cdf)}`,
        };
      }
      case "lognormal": {
        const pdf =
          (1 / (input.x * input.sigma * Math.sqrt(2 * Math.PI))) *
          Math.exp(-((Math.log(input.x) - input.mu) ** 2) / (2 * input.sigma ** 2));
        const cdf = normalCdf(Math.log(input.x), input.mu, input.sigma);
        return {
          family: input.family,
          pdf: round(pdf, 8),
          cdf: round(cdf, 8),
          latex: `f(${L(input.x)})=${L(pdf)},\\quad F(${L(input.x)})=${L(cdf)}`,
        };
      }
      case "uniforme": {
        if (input.b <= input.a) throw new Error("Se requiere b > a.");
        const pdf = input.x >= input.a && input.x <= input.b ? 1 / (input.b - input.a) : 0;
        const cdf =
          input.x < input.a
            ? 0
            : input.x > input.b
              ? 1
              : (input.x - input.a) / (input.b - input.a);
        return {
          family: input.family,
          pdf: round(pdf, 8),
          cdf: round(cdf, 8),
          mean: round((input.a + input.b) / 2),
          variance: round((input.b - input.a) ** 2 / 12),
          latex: `f(x)=\\frac{1}{${L(input.b)}-${L(input.a)}},\\quad F(${L(input.x)})=${L(cdf)}`,
        };
      }
      case "gamma": {
        const pdf = gammaPdf(input.x, input.shape, input.scale);
        return {
          family: input.family,
          pdf: round(pdf, 8),
          mean: round(input.shape * input.scale),
          variance: round(input.shape * input.scale ** 2),
          latex: `f(${L(input.x)};\\,\\alpha=${L(input.shape)},\\,\\theta=${L(input.scale)})=${L(pdf)}`,
        };
      }
      case "beta": {
        const pdf = betaPdf(input.x, input.alpha, input.beta);
        const mean = input.alpha / (input.alpha + input.beta);
        const variance =
          (input.alpha * input.beta) /
          ((input.alpha + input.beta) ** 2 * (input.alpha + input.beta + 1));
        return {
          family: input.family,
          pdf: round(pdf, 8),
          mean: round(mean),
          variance: round(variance),
          latex: `f(${L(input.x)};\\,\\alpha=${L(input.alpha)},\\,\\beta=${L(input.beta)})=${L(pdf)}`,
        };
      }
    }
  },
});

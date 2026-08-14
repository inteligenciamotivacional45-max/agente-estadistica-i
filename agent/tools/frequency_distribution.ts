import { defineTool } from "eve/tools";
import { z } from "zod";
import { latexNum, round, sorted } from "../lib/math";

export default defineTool({
  description:
    "Unidad 1: tabla de frecuencias (absoluta, relativa, acumulada), marcas de clase y regla de Sturges. Datos crudos o número de clases indicado.",
  inputSchema: z.object({
    values: z.array(z.number()).min(2).describe("Datos crudos"),
    classes: z
      .number()
      .int()
      .min(2)
      .optional()
      .describe("Número de intervalos. Si se omite, se usa Sturges"),
  }),
  async execute({ values, classes }) {
    const xs = sorted(values);
    const n = xs.length;
    const xmin = xs[0];
    const xmax = xs[n - 1];
    const span = xmax - xmin;
    const sturges = Math.max(2, Math.round(1 + 3.322 * Math.log10(n)));
    const k = classes ?? sturges;
    const width = span === 0 ? 1 : span / k;

    const rows = [];
    let cum = 0;
    for (let i = 0; i < k; i++) {
      const lower = xmin + i * width;
      const upper = i === k - 1 ? xmax : xmin + (i + 1) * width;
      const count = xs.filter((v) =>
        i === k - 1 ? v >= lower && v <= upper : v >= lower && v < upper,
      ).length;
      cum += count;
      const mark = (lower + upper) / 2;
      rows.push({
        class: i + 1,
        lower: round(lower, 4),
        upper: round(upper, 4),
        mark: round(mark, 4),
        ni: count,
        fi: round(count / n, 6),
        Ni: cum,
        Fi: round(cum / n, 6),
      });
    }

    const L = latexNum;
    const lines = rows
      .map(
        (r) =>
          `${r.class} & ${L(r.lower, 3)} & ${L(r.upper, 3)} & ${L(r.mark, 3)} & ${r.ni} & ${L(r.fi, 3)} & ${r.Ni} & ${L(r.Fi, 3)} \\\\`,
      )
      .join("\n");

    return {
      n,
      min: xmin,
      max: xmax,
      sturges,
      classes: k,
      width: round(width, 6),
      rows,
      latex: {
        sturges: `k \\approx 1 + 3.322\\,\\log_{10} ${n} = ${sturges}`,
        width: `h = \\frac{x_{\\max}-x_{\\min}}{k} = ${L(width)}`,
        table: `\\begin{array}{c|ccccccc}\n i & L_i & U_i & x_i^* & n_i & f_i & N_i & F_i \\\\ \\hline\n${lines}\n\\end{array}`,
      },
    };
  },
});

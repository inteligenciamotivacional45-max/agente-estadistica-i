import { defineTool } from "eve/tools";
import { z } from "zod";
import { COURSE_FORMULAS, findFormulas } from "../lib/formulas";

export default defineTool({
  description:
    "Devuelve las fórmulas canónicas del curso del Docente Mgr Alfredo Delgadillo Cossio en LaTeX. Usa un id (media, bayes, normal, mle, …), un título, o el número de unidad 1–8.",
  inputSchema: z.object({
    topic: z
      .string()
      .min(1)
      .describe("Id, nombre o número de unidad (1-8). Vacío no aplica; usa 'catalogo' para listar."),
  }),
  async execute({ topic }) {
    if (topic.trim().toLowerCase() === "catalogo") {
      return {
        count: COURSE_FORMULAS.length,
        catalog: COURSE_FORMULAS.map((f) => ({
          id: f.id,
          unit: f.unit,
          title: f.title,
        })),
      };
    }
    const hits = findFormulas(topic);
    if (!hits.length) {
      return {
        found: false,
        hint: "Prueba un id del catálogo o un número de unidad 1–8.",
        ids: COURSE_FORMULAS.map((f) => f.id),
      };
    }
    return {
      found: true,
      formulas: hits.map((f) => ({
        id: f.id,
        unit: f.unit,
        title: f.title,
        latex: f.latex,
        notes: f.notes,
        block: `$$\n${f.latex}\n$$`,
      })),
    };
  },
});

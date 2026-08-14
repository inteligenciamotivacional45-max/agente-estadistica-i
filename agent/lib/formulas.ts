export type CourseFormula = {
  id: string;
  unit: number;
  title: string;
  latex: string;
  notes: string;
};

export const COURSE_FORMULAS: CourseFormula[] = [
  {
    id: "frecuencia-relativa",
    unit: 1,
    title: "Frecuencia relativa",
    latex: "f_i = \\frac{n_i}{n}, \\qquad \\sum_i f_i = 1",
    notes: "n_i es la frecuencia absoluta de la clase i; n es el tamaño de la muestra.",
  },
  {
    id: "marca-clase",
    unit: 1,
    title: "Marca de clase",
    latex: "x_i^* = \\frac{L_i + U_i}{2}",
    notes: "L_i y U_i son los límites inferior y superior del intervalo.",
  },
  {
    id: "sturges",
    unit: 1,
    title: "Número de clases (Sturges)",
    latex: "k \\approx 1 + 3.322 \\, \\log_{10} n",
    notes: "Regla orientativa para formar la distribución de frecuencias. El ancho es (x_{\\max}-x_{\\min})/k.",
  },
  {
    id: "media",
    unit: 2,
    title: "Media aritmética",
    latex: "\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i",
    notes: "Para datos agrupados: \\bar{x} = (\\sum n_i x_i^*)/n.",
  },
  {
    id: "media-ponderada",
    unit: 2,
    title: "Media aritmética ponderada",
    latex: "\\bar{x}_w = \\frac{\\sum w_i x_i}{\\sum w_i}",
    notes: "w_i es el peso de cada observación o clase.",
  },
  {
    id: "media-geometrica",
    unit: 2,
    title: "Media geométrica",
    latex: "G = \\left( \\prod_{i=1}^{n} x_i \\right)^{1/n} = \\exp\\!\\left( \\frac{1}{n} \\sum \\ln x_i \\right)",
    notes: "Requiere x_i > 0. Típica en tasas de crecimiento.",
  },
  {
    id: "media-armonica",
    unit: 2,
    title: "Media armónica",
    latex: "H = \\frac{n}{\\sum_{i=1}^{n} (1/x_i)}",
    notes: "Útil para promedios de velocidades o razones. Se cumple H \\le G \\le \\bar{x}.",
  },
  {
    id: "pearson-moda",
    unit: 2,
    title: "Relación empírica de Pearson",
    latex: "\\mathrm{Mo} \\approx 3\\,\\mathrm{Me} - 2\\,\\bar{x}",
    notes: "Aproximación para distribuciones unimodales moderadamente asimétricas.",
  },
  {
    id: "varianza",
    unit: 2,
    title: "Varianza y desviación estándar muestrales",
    latex:
      "s^2 = \\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2, \\qquad s = \\sqrt{s^2}",
    notes: "Con divisor n se obtiene la versión poblacional \\sigma^2. El coeficiente de variación es CV = s/\\bar{x}.",
  },
  {
    id: "variable-tipificada",
    unit: 2,
    title: "Variable normalizada (tipificada)",
    latex: "z_i = \\frac{x_i - \\bar{x}}{s}",
    notes: "Permite comparar observaciones de distintas escalas. Media 0 y desviación 1 si se usa la misma s.",
  },
  {
    id: "cuartiles",
    unit: 2,
    title: "Cuartiles e IQR",
    latex: "Q_1 = P_{25}, \\quad Q_2 = P_{50} = \\mathrm{Me}, \\quad Q_3 = P_{75}, \\quad \\mathrm{IQR} = Q_3 - Q_1",
    notes: "El rango semi-intercuartílico es (Q_3-Q_1)/2.",
  },
  {
    id: "minimos-cuadrados",
    unit: 3,
    title: "Recta de mínimos cuadrados",
    latex:
      "\\hat{y} = a + bx, \\qquad b = \\frac{\\sum (x_i-\\bar{x})(y_i-\\bar{y})}{\\sum (x_i-\\bar{x})^2}, \\qquad a = \\bar{y} - b\\bar{x}",
    notes: "Minimiza \\sum (y_i - \\hat{y}_i)^2. En hidrología suele usarse caudal vs. precipitación o nivel vs. gasto.",
  },
  {
    id: "correlacion",
    unit: 3,
    title: "Coeficiente de correlación lineal (Pearson)",
    latex:
      "r = \\frac{\\sum (x_i-\\bar{x})(y_i-\\bar{y})}{\\sqrt{\\sum (x_i-\\bar{x})^2 \\sum (y_i-\\bar{y})^2}}",
    notes: "r^2 es el coeficiente de determinación: variación explicada sobre variación total.",
  },
  {
    id: "error-tipico",
    unit: 3,
    title: "Error típico de la estimación",
    latex: "s_{y|x} = \\sqrt{\\frac{\\sum (y_i - \\hat{y}_i)^2}{n-2}}",
    notes: "Dispersion de los residuales alrededor de la recta. n-2 grados de libertad.",
  },
  {
    id: "probabilidad-clasica",
    unit: 4,
    title: "Definición clásica de probabilidad",
    latex: "P(A) = \\frac{\\# A}{\\# \\Omega}",
    notes: "Válida cuando los resultados del espacio muestral son igualmente verosímiles.",
  },
  {
    id: "condicional",
    unit: 4,
    title: "Probabilidad condicional e independencia",
    latex: "P(A\\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\qquad A \\perp B \\iff P(A \\cap B) = P(A)P(B)",
    notes: "Si A y B son mutuamente excluyentes, P(A \\cap B) = 0 y P(A \\cup B) = P(A)+P(B).",
  },
  {
    id: "combinatoria",
    unit: 4,
    title: "Permutaciones y combinaciones",
    latex: "P(n,k) = \\frac{n!}{(n-k)!}, \\qquad C(n,k) = \\binom{n}{k} = \\frac{n!}{k!(n-k)!}",
    notes: "Permutaciones: el orden importa. Combinaciones: no importa.",
  },
  {
    id: "bayes",
    unit: 4,
    title: "Teorema de Bayes",
    latex:
      "P(A_i\\mid B) = \\frac{P(B\\mid A_i)P(A_i)}{\\sum_j P(B\\mid A_j)P(A_j)}",
    notes: "Actualiza la probabilidad de una causa A_i dada evidencia B. Muy usado en diagnóstico y fallas.",
  },
  {
    id: "binomial",
    unit: 5,
    title: "Distribución binomial",
    latex:
      "P(X=k) = \\binom{n}{k} p^k (1-p)^{n-k}, \\qquad \\mathbb{E}[X]=np, \\quad \\mathrm{Var}(X)=np(1-p)",
    notes: "n ensayos de Bernoulli independientes con probabilidad p de éxito.",
  },
  {
    id: "hipergeometrica",
    unit: 5,
    title: "Distribución hipergeométrica",
    latex:
      "P(X=k) = \\frac{\\binom{K}{k}\\binom{N-K}{n-k}}{\\binom{N}{n}}",
    notes: "Muestreo sin reemplazo de una población finita N con K éxitos.",
  },
  {
    id: "poisson",
    unit: 5,
    title: "Poisson como aproximación de la binomial",
    latex:
      "P(X=k) = e^{-\\lambda} \\frac{\\lambda^k}{k!}, \\qquad \\lambda = np \\text{ cuando } n\\to\\infty,\\ p\\to 0",
    notes: "Útil para conteos raros: avenidas, fallas, llegadas.",
  },
  {
    id: "geometrica",
    unit: 5,
    title: "Distribución geométrica",
    latex: "P(X=k) = (1-p)^{k-1}p, \\qquad \\mathbb{E}[X]=1/p",
    notes: "Ensayos hasta el primer éxito, contando ese ensayo.",
  },
  {
    id: "normal",
    unit: 6,
    title: "Distribución normal",
    latex:
      "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} \\exp\\!\\left( -\\frac{(x-\\mu)^2}{2\\sigma^2} \\right), \\qquad Z=\\frac{X-\\mu}{\\sigma} \\sim N(0,1)",
    notes: "La aproximación normal a la binomial usa \\mu=np y \\sigma=\\sqrt{np(1-p)}, a menudo con corrección 0.5.",
  },
  {
    id: "lognormal",
    unit: 6,
    title: "Distribución log-normal",
    latex: "X = e^{Y},\\ Y\\sim N(\\mu,\\sigma^2) \\implies f_X(x) = \\frac{1}{x\\sigma\\sqrt{2\\pi}} \\exp\\!\\left( -\\frac{(\\ln x-\\mu)^2}{2\\sigma^2} \\right)",
    notes: "Frecuente para caudales, precipitaciones y resistencias positivas.",
  },
  {
    id: "uniforme",
    unit: 6,
    title: "Distribución uniforme continua",
    latex: "f(x) = \\frac{1}{b-a},\\ x\\in[a,b], \\qquad \\mathbb{E}[X]=\\frac{a+b}{2},\\ \\mathrm{Var}(X)=\\frac{(b-a)^2}{12}",
    notes: "Densidad constante en un intervalo.",
  },
  {
    id: "esperanza",
    unit: 6,
    title: "Propiedades de la esperanza",
    latex: "\\mathbb{E}[aX+bY+c] = a\\,\\mathbb{E}[X] + b\\,\\mathbb{E}[Y] + c",
    notes: "La linealidad no exige independencia. Var(aX)=a^2 Var(X).",
  },
  {
    id: "ic-media",
    unit: 7,
    title: "Intervalo de confianza para la media (\\sigma conocida)",
    latex: "\\bar{x} \\pm z_{\\alpha/2} \\, \\frac{\\sigma}{\\sqrt{n}}",
    notes: "Si \\sigma es desconocida y n es pequeño, se reemplaza z por t_{n-1} y \\sigma por s.",
  },
  {
    id: "ic-proporcion",
    unit: 7,
    title: "Intervalo de confianza para una proporción",
    latex: "\\hat{p} \\pm z_{\\alpha/2} \\sqrt{\\frac{\\hat{p}(1-\\hat{p})}{n}}",
    notes: "Aproximación normal; requiere np y n(1-p) no demasiado pequeños.",
  },
  {
    id: "error-probable",
    unit: 7,
    title: "Error probable",
    latex: "0.6745 \\, \\frac{\\sigma}{\\sqrt{n}}",
    notes: "Radio del intervalo que cubre el 50% de la distribución muestral de la media (normal).",
  },
  {
    id: "momentos",
    unit: 8,
    title: "Método de los momentos",
    latex: "\\mathbb{E}[X^k] = m_k = \\frac{1}{n} \\sum_{i=1}^{n} x_i^k",
    notes: "Se igualan momentos poblacionales a muestrales para estimar parámetros.",
  },
  {
    id: "mle",
    unit: 8,
    title: "Máxima verosimilitud",
    latex:
      "L(\\theta) = \\prod_{i=1}^{n} f(x_i\\mid \\theta), \\qquad \\hat{\\theta}_{\\mathrm{MV}} = \\arg\\max_\\theta \\ell(\\theta),\\ \\ell=\\ln L",
    notes: "En el plan original aparece como «método de máxima probabilidad».",
  },
];

export function findFormulas(query: string): CourseFormula[] {
  const q = query.trim().toLowerCase();
  const asNum = Number(q);
  if (Number.isInteger(asNum) && asNum >= 1 && asNum <= 8) {
    return COURSE_FORMULAS.filter((f) => f.unit === asNum);
  }
  const exact = COURSE_FORMULAS.filter((f) => f.id === q);
  if (exact.length) return exact;
  return COURSE_FORMULAS.filter(
    (f) =>
      f.id.includes(q) ||
      f.title.toLowerCase().includes(q) ||
      f.notes.toLowerCase().includes(q),
  );
}

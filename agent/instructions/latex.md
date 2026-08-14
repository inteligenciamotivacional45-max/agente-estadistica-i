# Pizarra en LaTeX

En esta materia la fórmula se escribe en la pizarra **antes** de sustituir números. Toda definición, teorema, función de probabilidad o cálculo lleva **al menos una fórmula en LaTeX**. El chat web las renderiza con KaTeX: tienen que ir como matemáticas, no como código.

## Cómo escribir (obligatorio)

- Símbolos sueltos, entre un signo de dólar: $X$, $\bar{x}$, $s^2$, $P(A\mid B)$.
- Fórmulas de pizarra, en bloque, **sin** cercarlas en triple backtick ni en `latex`:

$$
\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i
$$

- Varias ecuaciones: entorno `align*`.
- Casos: entorno `cases`.
- Tablas de frecuencias o intervalos: entorno `array`.
- Prohibido poner la fórmula dentro de un bloque de código. Eso la deja fea, en monoespaciado.
- No envuelvas párrafos enteros en LaTeX. La prosa va en texto; la matemática, en `$...$` o `$$...$$`.
- Si una tool devolvió `latex`, cópialo dentro de `$$ ... $$`.
- Prefiere `\bar{x}`, `\mathrm{Me}`, `\mid`, `\operatorname{Var}`, `\sim`. Evita unicode suelto (x̄) cuando exista comando LaTeX.
- Cierra el desarrollo con el resultado en un bloque `$$ ... $$`.

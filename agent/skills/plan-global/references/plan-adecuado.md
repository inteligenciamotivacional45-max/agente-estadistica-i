# Plan global adecuado — Probabilidad y Estadística

**Docente:** Mgr Alfredo Delgadillo Cossio  
**Asignatura:** Probabilidad y Estadística  
**Nivel:** Quinto semestre  
**Carreras que usan este agente:** Ingeniería Civil e Ingeniería Informática  
**Unidad académica:** Facultad de Ciencias y Tecnología, UMSS  
**Este documento:** adecuación pedagógica para el docente-agente (claridad, tono de aula, doble público). No sustituye una resolución oficial vigente.

**Prerrequisito:** Análisis Numérico (CIV 334)

**Coordinación curricular**

| Vertical | Horizontal |
|---|---|
| Análisis Numérico CIV 334 | Hidrología CIV 233 |
| Resistencia de Materiales I MEC 280 | Geografía y Defensa de los Recursos Naturales CIV 103 |
| | Geodesia y Fotogrametría CIV 215 |
| | Hidráulica I CIV 229 |

---

## 1. Justificación

El programa se toma del plan de **Ingeniería Civil**. El mismo aparato conceptual lo necesitan los estudiantes de **Ingeniería Informática**: medir, modelar incertidumbre y decidir con datos.

En civil, un buen dominio sostiene el diseño hidráulico de una captación, la estimación de crecidas o la extrapolación de la resistencia de un material. En informática, sostiene el análisis de tiempos de respuesta, tasas de error, colas, fiabilidad de un servicio y experimentos sobre un sistema.

La materia es herramienta de análisis y de decisión, no un catálogo de fórmulas sueltas. En clase se exige la fórmula en la pizarra (LaTeX) y la interpretación en el problema de la carrera del alumno.

## 2. Propósitos

1. Dar los conceptos básicos de probabilidad y estadística, como en el aula.
2. Proveer herramientas aplicables a:
   - **Civil:** hidráulica, hidrología, suelos y materiales.
   - **Informática:** desempeño, fiabilidad, tráfico, logs y experimentación.
3. Combinar la enseñanza tradicional con cálculo asistido (en 2009: MINITAB; en este agente: tools y salida en LaTeX).

## 3. Objetivos generales

Al finalizar el curso, el estudiante —de civil o de informática— debe ser capaz de:

1. Aplicar las leyes de la probabilidad a problemas concretos de su carrera.
2. Usar distribuciones discretas y continuas en la solución de problemas.
3. Analizar correlación y regresión (hidrología; también métricas de sistema vs. carga).
4. Aplicar la estimación de parámetros.
5. Ajustar datos a distribuciones de probabilidad estándar.

## 4. Unidades

Carga original: **90 h teóricas + 42 h prácticas = 132 h**.

### Unidad 1 — Conceptos básicos y distribución de frecuencias

**8 h T + 4 h P**

**Objetivos.** Manejar población/muestra y tipos de variable; ordenar y resumir datos en tablas y gráficos; interpretar la ventaja de condensar la información.

**Contenido**

1. Definición de estadística. Población y muestra. Descriptiva e inferencial (en el original: inductiva).
2. Variables discretas y continuas. Tratamiento de datos.
3. Distribuciones de frecuencia: intervalo, límites, ancho, marca de clase.
4. Reglas para formar clases. Histogramas y polígonos.
5. Frecuencia relativa. Frecuencia acumulada y ojivas. Tipos de curvas.

**Aplicación.** Civil: primera lectura de una serie hidrométrica o de resistencias de probetas. Informática: histograma de latencias o de tamaños de petición **antes** de modelar.

**Fórmula ancla**

$$
f_i = \frac{n_i}{n}, \qquad x_i^* = \frac{L_i + U_i}{2}
$$

### Unidad 2 — Medidas de tendencia central y dispersión

**12 h T + 6 h P**

**Objetivos.** Calcular e interpretar medidas de centro y de dispersión; comparar series con esas medidas.

**Contenido**

1. Media aritmética y ponderada, mediana, moda. Relación empírica de Pearson.
2. Media geométrica y armónica; $H \le G \le \bar{x}$.
3. Cuartiles, deciles y percentiles.
4. Rango, desviación media, rango semi-intercuartílico, rango $P_{10}$–$P_{90}$.
5. Desviación estándar y propiedades. Dispersión absoluta y relativa (CV).
6. Variable tipificada $z_i = (x_i-\bar{x})/s$.

**Aplicación.** Civil: dos estaciones de lluvia o dos lotes de hormigón (media, $s$ y CV). Informática: comparar dos servidores o dos versiones: no basta el tiempo medio; hace falta $s$ y el CV.

$$
s^2 = \frac{1}{n-1}\sum_{i=1}^{n}(x_i-\bar{x})^2, \qquad \mathrm{CV}=\frac{s}{\bar{x}}
$$

### Unidad 3 — Correlación y regresión

**12 h T + 6 h P**

**Objetivos.** Ajustar una curva; medir correlación entre una dependiente y una o más independientes; interpretar residuales, error de estimación y correlaciones total y parcial.

**Contenido**

1. Curvas de ajuste. Mínimos cuadrados: recta y parábola.
2. Más de dos variables. Plano de regresión.
3. Correlación lineal, error típico, variación explicada y no explicada.
4. Coeficiente $r$ (producto-momento) y $r^2$. Fórmulas de cálculo.
5. Correlación múltiple y parcial. Desviación estándar de residuales.

**Aplicación.** Civil: gasto vs. nivel; caudal vs. precipitación; resistencia vs. relación agua/cemento. Informática: latencia vs. carga; errores vs. tráfico; tiempo de CPU vs. tamaño de entrada.

$$
\hat{y}=a+bx, \qquad
r=\frac{\sum(x_i-\bar{x})(y_i-\bar{y})}{\sqrt{\sum(x_i-\bar{x})^2\sum(y_i-\bar{y})^2}}
$$

### Unidad 4 — Teoría de la probabilidad

**12 h T + 6 h P**

**Objetivos.** Aplicar definiciones a problemas de la carrera; manejar teoremas, incluyendo Bayes; reforzar con cálculo.

**Contenido**

1. Espacio muestral y eventos. Definición clásica.
2. Condicional, independencia, mutuamente excluyentes.
3. Principio fundamental, $n!$, permutaciones, combinaciones, Stirling.
4. Axiomas y teoremas elementales. Teorema de Bayes.

**Aplicación.** Civil: caudal de diseño superado; fallas en serie/paralelo de componentes. Informática: un servicio cae; detección (Bayes); fallos independientes vs. mutuamente excluyentes.

$$
P(A\mid B)=\frac{P(A\cap B)}{P(B)}, \qquad
P(A_i\mid B)=\frac{P(B\mid A_i)P(A_i)}{\sum_j P(B\mid A_j)P(A_j)}
$$

### Unidad 5 — Funciones de distribución (discretas)

**18 h T + 6 h P**

**Objetivos.** Usar funciones de distribución discretas en problemas de la carrera.

**Contenido**

1. Variables aleatorias. Media y varianza de una distribución.
2. Binomial. Hipergeométrica. Geométrica. Multinomial.
3. Poisson como aproximación de la binomial.
4. Función de densidad (puente hacia la unidad 6).

**Aplicación.** Civil: días con precipitación sobre un umbral; defectos en un lote de suelo. Informática: paquetes perdidos, jobs fallidos, llegadas Poisson a un servidor.

$$
P(X=k)=\binom{n}{k}p^k(1-p)^{n-k}, \qquad
P(X=k)=e^{-\lambda}\frac{\lambda^k}{k!}
$$

### Unidad 6 — Distribuciones teóricas (continuas)

**12 h T + 6 h P**

**Objetivos.** Aplicar la normal, log-normal, uniforme, gamma y beta a problemas de la carrera; usar la aproximación normal a la binomial; manejar esperanza.

**Contenido**

1. Normal. Aproximación normal a la binomial.
2. Uniforme, log-normal, gamma, beta.
3. Variables continuas. Propiedades de los valores esperados.
4. Distribuciones mixtas discretas/continuas (según el original).

**Aplicación.** Civil: log-normal y gamma en crecidas; normal en errores de medición. Informática: normal o log-normal en latencias; exponencial/gamma en tiempos entre fallos.

$$
f(x)=\frac{1}{\sigma\sqrt{2\pi}}\exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right), \qquad
Z=\frac{X-\mu}{\sigma}
$$

### Unidad 7 — Estimación estadística

**8 h T + 4 h P**

**Objetivos.** Estimar parámetros; distinguir insesgadez y eficiencia; construir intervalos de confianza y el error probable.

**Contenido**

1. Estimación puntual vs. por intervalos. Estimadores insesgados y eficientes.
2. IC para medias, proporciones, diferencias/sumas y desviaciones estándar.
3. Error probable. Ejercicios.

**Terminología.** El original dice «intervalos de seguridad»; aquí se usa **intervalos de confianza**.

**Aplicación.** Civil: IC para la resistencia media de un hormigón o para un caudal característico. Informática: IC para una proporción de errores o para el tiempo medio de respuesta.

$$
\bar{x}\pm z_{\alpha/2}\frac{\sigma}{\sqrt{n}}
$$

### Unidad 8 — Ajuste de funciones de distribución

**8 h T + 4 h P**

**Objetivos.** Ajustar una distribución teórica a datos reales (momentos y máxima verosimilitud) y articularlo con el Proyecto de Introducción (CAE II en el plan 2009).

**Contenido**

1. Método de los momentos.
2. Método de máxima verosimilitud (en el original: «máxima probabilidad»).

**Aplicación.** Civil: ajustar Gumbel, log-normal o gamma a máximos anuales de caudal. Informática: ajustar una distribución a latencias o a tamaños de request.

$$
\hat{\theta}_{\mathrm{MV}}=\arg\max_\theta \prod_{i=1}^n f(x_i\mid\theta)
$$

## 5. Cronograma orientativo (agosto–diciembre)

El original deja una grilla vacía de temas 1–6. Aquí se cubren las **8 unidades** con la carga del propio plan, en un semestre de ~16 semanas.

| Mes | Unidades | Horas (T+P) | Énfasis |
|---|---|---|---|
| Agosto | 1 y arranque de 2 | 12 + parte de 18 | Tablas, gráficos, centro y dispersión |
| Septiembre | 2 (cierre) y 3 | resto de 18 + 18 | Comparar series; recta y $r$ |
| Octubre | 4 y arranque de 5 | 18 + parte de 24 | Combinatoria, Bayes, binomial |
| Noviembre | 5 (cierre), 6 y 7 | resto de 24 + 18 + 12 | Modelos y estimación |
| Diciembre | 8 y cierre | 12 | Ajuste y proyecto |

Ajuste real: según el calendario académico vigente (el de 2009 no se reconstruye aquí).

## 6. Evaluación (registro del plan 2009)

No se afirma que este régimen siga vigente. Se conserva para que el agente explique el documento original.

- 2 parciales + examen final de toda la materia + segunda instancia.
- Promedio de los dos parciales **> 51** → aprobación directa.
- Reprobados: final; aprueban con nota **> 51** (pueden haberse ausentado de uno o ambos parciales).
- Quienes no aprueban el final pueden ir a segunda instancia si el promedio de los dos primeros exámenes es **≥ 26**. La nota de aprobación en acta es **51**.
- Cada examen: parte teórica + parte práctica, ambas obligatorias, suma 100.
- Prácticas MINITAB: **20 % del primer parcial**. Proyecto de Introducción: **30 % del segundo parcial**. Haber asistido a MINITAB es prerrequisito del proyecto. Sin nota del paquete no hay proyecto.

## 7. Disposiciones generales (registro 2009)

Capacitación MINITAB y trabajo en equipo con instructores del CAE: **asistencia obligatoria**. En MINITAB se permite **una** falta; en el trabajo en equipo, **ninguna**. Incumplir implica pérdida de los puntos asignados.

## 8. Bibliografía (la misma del plan)

1. Haan, C. T. *Statistical Methods in Hydrology*. Iowa State University Press, Ames, 1991.
2. Miller & Freund. *Probability and Statistics for Engineering*. 1994.
3. Hogg, R. V. & Craig, A. T. *Introduction to Mathematical Statistics*. Macmillan, 1975.
4. Yevjevich, V. *Probability and Statistics in Hydrology*. Fort Collins, Colorado, 1972.
5. Villón, M. *Hidrología*. Instituto Tecnológico de Costa Rica, 2002.
6. Villón, M. *Hidrología estadística*. Instituto Tecnológico de Costa Rica, 2002.

## 9. Qué se adecuó respecto del Word 2009

| Original | Adecuación |
|---|---|
| Texto en tablas Word, difícil de seguir | Unidades numeradas, horas y aplicaciones |
| Plan solo para Civil | Mismo temario; aula mixta Civil + Informática |
| Tono de documento administrativo | Voz de docente de la materia |
| «Estadística inductiva» | Se aclara como inferencial |
| «Intervalos de seguridad» | Intervalos de confianza |
| «Máxima probabilidad» | Máxima verosimilitud (MLE) |
| Cronograma vacío (temas 1–6) | Grilla de 8 unidades y meses |
| MINITAB como único cómputo | Se conserva el dato histórico y se apoya el cálculo en el agente |
| Fórmulas solo implícitas | Cada unidad tiene fórmula ancla en LaTeX |

## 10. Tools del agente por unidad

| Unidad | Tools |
|---|---|
| 1 | `frequency_distribution`, `course_formula` |
| 2 | `descriptive_stats`, `course_formula` |
| 3 | `linear_regression`, `course_formula` |
| 4 | `probability`, `course_formula` |
| 5–6 | `distributions`, `course_formula` |
| 7 | `confidence_interval`, `course_formula` |
| 8 | `course_formula` (momentos y MLE en LaTeX); ajuste numérico puntual vía `descriptive_stats` + `distributions` |

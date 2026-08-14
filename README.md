# Probabilidad y Estadística

Aula web del **Docente Mgr Alfredo Delgadillo Cossio** (UMSS — FCyT) para estudiantes de **Ingeniería Civil** e **Ingeniería Informática**.

Las fórmulas se escriben en LaTeX y el chat las muestra con KaTeX.

## Estudiantes

Abran el enlace de Vercel e escriban en el chat (unidad, ejercicio o fórmula).

## Desarrollo local

```bash
cp .env.example .env.local
# pega NEXOROUTER_API_KEY en .env.local
npm install
npm run dev
```

- Chat web: `http://localhost:3000`
- Terminal del docente: `npm run dev:tui`

## Variables

| Variable | Dónde |
|---|---|
| `NEXOROUTER_API_KEY` | `.env.local` y en Vercel → Environment Variables |
| `NEXOROUTER_MODEL` | opcional; por defecto `kimi-k2.6` |

No subas `.env.local` a GitHub.

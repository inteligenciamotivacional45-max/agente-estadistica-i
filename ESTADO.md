# Estado del aula y mejoras pendientes

Documento para retomar el proyecto: qué hay, qué se decidió y qué conviene mejorar.

## Qué es

**Agente de Estadística I** — chat web del **Docente Mgr Alfredo Delgadillo Cossio** (UMSS · FCyT) para **Ingeniería Civil** e **Ingeniería Informática**. Plan de referencia: CIV 271 / `PLAN_GLOBAL.md` (8 unidades). Las fórmulas van en LaTeX y el chat las pinta con **KaTeX**.

No debe presentarse como “plan CIV 271”; habla como el docente.

## Dónde está

| Qué | Dónde |
|---|---|
| Código | https://github.com/inteligenciamotivacional45-max/agente-estadistica-i (`main`) |
| Aula pública (producción) | **https://agente-estadistica-i.srv1825081.hstgr.cloud** |
| VPS Hostinger KVM 2 | `179.197.70.116` · Ubuntu 24.04 · hostname `srv1825081` |
| App en el VPS | `/docker/agente-estadistica-i` (Docker + Traefik) |
| Local | `http://localhost:3000` (`npm run dev`) |

Otras apps en el **mismo VPS** (no tocar sin pedir): n8n, AgendaPro, Quipu, convertir-md, Traefik, Hermes. Traefik en host mode, Let’s Encrypt, patrón `{app}.srv1825081.hstgr.cloud`.

## Stack

- **Eve** 0.37.0 + **Next.js** 16 (canal web `withEve`)
- **Auth.js** (next-auth v5) con Google. Solo correos UMSS (`@est.umss.edu`, `@umss.edu.bo`, `@umss.edu` y subdominios) o los de `TEACHER_EMAILS`
- Interruptor docente en `/docente` (SQLite en el volumen `.eve/.workflow-data/aula.sqlite`)
- Modelo: **NexoRouter** `https://api.nexorouter.com/v1`, modelo `kimi-k2.6`
- Key: `NEXOROUTER_API_KEY` en `.env.local` (PC) y `/docker/agente-estadistica-i/.env` (VPS). **No está en GitHub.**
- Auth del canal Eve: cookie de sesión Auth.js, luego `vercelOidc()`, `localDev()`. **Ya no hay `none()`**
- Tools: `descriptive_stats`, `frequency_distribution`, `linear_regression`, `probability`, `distributions`, `confidence_interval`, `course_formula`
- Skill: `agent/skills/plan-global/`
- LaTeX: `$...$` / `$$...$$` — **prohibido** cercar fórmulas en ` ```latex ` (rompe KaTeX)

## Acceso UMSS

- Estudiantes: Google Workspace `@est.umss.edu` (el de Moodle). Microsoft `@ms.umss.edu` no entra.
- Docente: cualquier cuenta Google listada en `TEACHER_EMAILS`. Puede chatear aunque el aula esté cerrada.
- Aula cerrada por defecto hasta que el docente la abra.
- Redirect de Google en producción: `https://agente-estadistica-i.srv1825081.hstgr.cloud/api/auth/callback/google`

## Producción en el VPS (importante)

`next start` **solo** no basta si falta el build de Eve. Next hace proxy a Eve en el puerto **4274**. Hace falta:

1. `eve build` (genera `.output`) — ocurre en el Dockerfile
2. `next start` en `0.0.0.0:3000` (el entrypoint); Next sirve `.output` en `EVE_NEXT_PRODUCTION_PORT=4274`

Rebuild: `cd /docker/agente-estadistica-i && docker compose up --build -d`.

El volumen Docker debe ser **solo** `.eve/.workflow-data`. Montar todo `.eve` borra el runtime compilado y el chat vuelve a 500. Ahí también vive `aula.sqlite`.

## Decisiones ya tomadas

- **No Vercel por ahora**: la cuenta pidió SMS y la línea quedó bloqueada. Existe el team [delgadillocossio-hubs-projects](https://vercel.com/delgadillocossio-hubs-projects). Entrar con **Log in**, no Sign up.
- **No API oficial de Kimi (platform.kimi.ai)** si la cuenta está suspendida por saldo. NexoRouter es el proveedor activo.
- Hosting compartido / builder de Hostinger **no** sirve; el VPS KVM 2 sí.
- El túnel Cloudflare (`*.trycloudflare.com`) fue solo para pruebas; no es el enlace del curso.
- Login: Google institucional, no contraseña propia ni Microsoft 365.

## Problemas conocidos

1. Sin `GOOGLE_CLIENT_ID` / `AUTH_SECRET` / `TEACHER_EMAILS` en el VPS, nadie entra (estudiantes ni docente).
2. Keys pegadas en el chat de Cursor: conviene **rotarlas** en las consolas.
3. Pensamiento del modelo a la vista (“Thought for N seconds”, “Thinking…”).
4. Windows local: fallos `fetch failed` / IPv6; el script `dev` usa `--dns-result-order=ipv4first`.
5. Next.js bloquea orígenes de dev; `allowedDevOrigins` incluye localhost, `127.0.0.1`, LAN y túneles.
6. Node del VPS es 20; la app pide **24.x** — por eso corre en Docker `node:24`.
7. Deploy manual: `git pull` + `docker compose up --build -d`. No hay CI.
8. Sin dominio propio: solo `*.hstgr.cloud`.
9. Sin backups explícitos del volumen `eve_workflow` (incluye el aula SQLite).

## Qué mejorar (prioridad)

### Alto

- Rotar `NEXOROUTER_API_KEY` y la de Kimi; no volver a pegar keys en el chat.
- Ocultar o colapsar por defecto el bloque de pensamiento del modelo.
- Mensaje de error humano en el chat si Eve/NexoRouter fallan.

### Medio

- Dominio tipo `estadistica.tudominio.com` (DNS A → VPS, label Traefik).
- Deploy al VPS con GitHub Action.
- Recargar Kimi oficial **solo** cuando haya saldo.

### Bajo / aula

- Horarios semanales o semestres automáticos sobre el mismo panel `/docente`.
- Más ejercicios resueltos por unidad (Civil vs Informática).
- Snapshots del VPS en hPanel.

## Cómo probar

- Local: `npm run dev` → `http://localhost:3000` (no `127.0.0.1` si falla CSS).
- Producción: recargar https://agente-estadistica-i.srv1825081.hstgr.cloud
- Salud Eve: `https://agente-estadistica-i.srv1825081.hstgr.cloud/eve/v1/health` → `{"ok":true,"status":"ready"}`
- Pregunta de humo (aula abierta y sesión UMSS): media de 2, 4, 6 y 8; debe salir \(\bar{x}=5\) en KaTeX.
- Dominios: `npm test`

## Qué no hacer

- No commitear `.env` / `.env.local`.
- No borrar contenedores n8n, Traefik u otras apps del VPS.
- No montar el volumen Docker sobre `/app/.eve` entero.
- No volver a poner `none()` en `agent/channels/eve.ts`.
- No reintentar SMS de Vercel en bucle (alarga el bloqueo).

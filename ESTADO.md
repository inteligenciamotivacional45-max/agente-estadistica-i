# Estado del aula — para retomar el trabajo

Última actualización: **14 ago 2026**.

Documento para volver al proyecto: qué hay en producción, qué se decidió y qué conviene hacer después.

## Qué es

**Agente de Estadística I** — chat web del **Docente Mgr Alfredo Delgadillo Cossio** (UMSS · FCyT) para **Ingeniería Civil** e **Ingeniería Informática**. Plan de referencia: CIV 271 / `PLAN_GLOBAL.md` (8 unidades). Las fórmulas van en LaTeX y el chat las pinta con **KaTeX**.

No debe presentarse como “plan CIV 271”; habla como el docente.

Las respuestas van **concretas** (planteo → fórmula → resultado → una interpretación) para gastar menos tokens sin bajar la notación.

## Dónde está

| Qué | Dónde |
|---|---|
| Aula (producción) | **https://agente-estadistica-i.srv1825081.hstgr.cloud** |
| Panel docente | **https://agente-estadistica-i.srv1825081.hstgr.cloud/docente** |
| Salud Eve | `https://agente-estadistica-i.srv1825081.hstgr.cloud/eve/v1/health` → `{"ok":true,"status":"ready"}` |
| Código GitHub | https://github.com/inteligenciamotivacional45-max/agente-estadistica-i (`main`) |
| Rama de trabajo / PR | `cursor/solo-docente-titular-c1ee` (solo el titular entra como docente) |
| VPS (checkout) | Misma línea que `main` tras el merge; carpeta `/docker/agente-estadistica-i` |
| VPS Hostinger KVM 2 | `179.197.70.116` · Ubuntu 24.04 · hostname `srv1825081` |
| App en el VPS | `/docker/agente-estadistica-i` (Docker + Traefik) |
| `.env` del VPS | `/docker/agente-estadistica-i/.env` (no está en Git) |
| Local | `http://localhost:3000` (`npm run dev`) |

Otras apps en el **mismo VPS** (no tocar sin pedir): n8n, AgendaPro, Quipu, convertir-md, Traefik, Hermes. Traefik en host mode, Let’s Encrypt, patrón `{app}.srv1825081.hstgr.cloud`.

**Cuidado:** no vuelva a poner `none()` en el canal Eve. El chat público sin login era el estado anterior de `main`.

## Qué quedó hecho (ago 2026)

1. **Login Google UMSS.** El enlace ya no es público. Estudiantes con `@est.umss.edu` (Google Workspace / Moodle). Microsoft `@ms.umss.edu` no entra. Como docente solo entra **el titular** (`d.delgadillo@umss.edu`); otros `@umss.edu` / `@umss.edu.bo` no entran, aunque figuren en `ALLOWED_EMAIL_DOMAINS`.
2. **Panel `/docente`.** Interruptor abrir/cerrar aula + aviso + lista de quienes ya entraron. SQLite en el volumen Docker (`aula.sqlite`).
3. **Cerrar aula detiene el chat para todos**, incluido el docente. Eve rechaza turnos; la UI oculta el compositor y redirige a “El aula está cerrada”.
4. **OAuth de Google** creado y cargado en el `.env` del VPS (`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`). Redirect: `https://agente-estadistica-i.srv1825081.hstgr.cloud/api/auth/callback/google`.
5. **Respuestas concretas** (`agent/instructions.md`, `reasoning: "low"`) para ahorrar tokens.
6. **Docker en Git** (`Dockerfile`, `docker-compose.yml`, `docker-entrypoint.sh`): `eve start` en `127.0.0.1:4274` y `next start` en `3000`.

## Acceso

| Quién | Cómo |
|---|---|
| Estudiante | Google `@est.umss.edu`. Solo chatea si el aula está **abierta**. |
| Docente | Solo el correo titular en `TEACHER_EMAILS` (uno). Abre/cierra en `/docente`. |
| App Google | Si sigue en **Testing**, solo entran los *Test users*. Para el curso entero: publicar (Audience → In production). Ámbitos: email, profile, openid. |

Aula **cerrada por defecto** hasta que el docente la abra.

## Stack

- **Eve** 0.37.0 + **Next.js** 16 (`withEve`)
- **Auth.js** (next-auth v5) + Google. Estudiantes: solo `@est.umss.edu`. Docente titular: el primer correo de `TEACHER_EMAILS` (en producción, `d.delgadillo@umss.edu`). Otros `@umss.edu.bo` / `@umss.edu` no entran.
- Canal Eve: cookie de sesión, luego `vercelOidc()`, `localDev()`. **No hay `none()`**
- Modelo: NexoRouter `https://api.nexorouter.com/v1`, `kimi-k2.6`
- Tools: `descriptive_stats`, `frequency_distribution`, `linear_regression`, `probability`, `distributions`, `confidence_interval`, `course_formula`
- Skill: `agent/skills/plan-global/`
- LaTeX: `$...$` / `$$...$$` — **prohibido** cercar fórmulas en ` ```latex `

## SSH y deploy

- PC del docente: `ssh -i ~/.ssh/yupay_vps root@179.197.70.116`
- En el VPS hay una llave extra `cursor-agent-aula` en `/root/.ssh/authorized_keys` (para el agente de Cursor).
- Rebuild:

```bash
cd /docker/agente-estadistica-i
git fetch origin
git checkout main
git pull origin main
docker compose up --build -d
```

El volumen Docker debe ser **solo** `.eve/.workflow-data` (`eve_workflow`). Ahí viven los workflows de Eve y `aula.sqlite`. Montar todo `.eve` borra el runtime y el chat vuelve a 500.

Variables en `.env` del VPS (nombres; **valores nunca a Git**): `NEXOROUTER_API_KEY`, `NEXOROUTER_MODEL`, `AUTH_SECRET`, `AUTH_URL`, `AUTH_TRUST_HOST`, `TEACHER_EMAILS`, `ALLOWED_EMAIL_DOMAINS`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`.

## Decisiones ya tomadas

- **No Vercel por ahora** (bloqueo SMS). Team [delgadillocossio-hubs-projects](https://vercel.com/delgadillocossio-hubs-projects): **Log in**, no Sign up.
- **NexoRouter** es el proveedor activo (Kimi oficial suspendido por saldo).
- Hosting compartido Hostinger **no** sirve; el VPS KVM 2 sí.
- Login: Google institucional, no contraseña ni Microsoft 365.
- Ingreso docente: **solo** el primer correo de `TEACHER_EMAILS` (el titular). Otros docentes UMSS no entran.
- Al cerrar el aula, **nadie** chatea (ni el docente). Reabrir en `/docente`.

## Problemas conocidos

1. El Client Secret de Google se pegó en el chat de Cursor: **rotar** en Cloud Console y actualizar el `.env` del VPS.
2. App OAuth probablemente sigue en **Testing**: el curso no entra hasta publicarla o agregar test users.
3. Pensamiento del modelo a veces sigue a la vista; se bajó a `reasoning: "low"`, no se ocultó del todo en la UI.
4. Keys de NexoRouter/Kimi también estuvieron en historial de chat: conviene rotarlas.
5. Windows local: `fetch failed` / IPv6; `dev` usa `--dns-result-order=ipv4first`.
6. Node del VPS es 20; la app pide **24.x** → Docker `node:24`.
7. Deploy manual. No hay CI.
8. Sin dominio propio (`*.hstgr.cloud`) ni backups explícitos del volumen `eve_workflow`.

## Qué mejorar al volver

### Alto

- Publicar la app OAuth para todo el curso.
- Rotar `GOOGLE_CLIENT_SECRET` y `NEXOROUTER_API_KEY`.
- Ocultar/colapsar el bloque de pensamiento en la UI.
- Mensaje de error humano si Eve/NexoRouter fallan.

### Medio

- Dominio propio + label Traefik.
- Deploy con GitHub Action (`git pull` + `compose up --build`).
- Kimi oficial solo si hay saldo.

### Bajo / aula

- Horarios o semestres automáticos en `/docente`.
- Más ejercicios resueltos (Civil vs Informática).
- Snapshots del VPS en hPanel.

## Cómo retomar (checklist)

1. Abrir `ESTADO.md` y el repo en `main`.
2. Producción: recargar el aula; salud Eve; entrar con Google; `/docente` abrir/cerrar.
3. Pregunta de humo (aula abierta): media de 2, 4, 6 y 8 → \(\bar{x}=5\) en KaTeX, respuesta corta.
4. Local: `cp .env.example .env.local` (keys + Google + `TEACHER_EMAILS`) → `npm install` → `npm run dev`.
5. Dominios UMSS: `npm test`.
6. Cambios al agente: editar `agent/`, commit a `main`, en el VPS `git pull origin main` y `docker compose up --build -d`.

## Qué no hacer

- No commitear `.env` / `.env.local`.
- No volver a poner `none()` en `agent/channels/eve.ts`.
- No borrar n8n, Traefik u otras apps del VPS.
- No montar el volumen sobre `/app/.eve` entero.
- No reintentar SMS de Vercel en bucle.
- No pegar secrets otra vez en el chat.

# Probabilidad y Estadística

Aula web del **Docente Mgr Alfredo Delgadillo Cossio** (UMSS — FCyT) para estudiantes de **Ingeniería Civil** e **Ingeniería Informática**.

Las fórmulas se escriben en LaTeX y el chat las muestra con KaTeX.

## Estudiantes

1. Abran el enlace del aula.
2. Entren con **Google Workspace UMSS** (`@est.umss.edu`), el mismo de Moodle.
3. El correo Microsoft `@ms.umss.edu` **no** abre esta aula.
4. El chat solo funciona cuando el docente habilita el aula.

## Docente

En `/docente` puede abrir o cerrar el aula y dejar un aviso. Al **cerrar**, el chat se detiene para todos (estudiantes y docente). Su correo Google debe estar en `TEACHER_EMAILS`.

## Desarrollo local

```bash
cp .env.example .env.local
# pegue NEXOROUTER_API_KEY, AUTH_SECRET y las credenciales de Google
npm install
npm run dev
```

- Chat web: `http://localhost:3000`
- Terminal del docente: `npm run dev:tui`

En local, `eve dev` sigue autenticando el TUI sin Google (`localDev()`). El navegador en producción exige sesión.

## Google OAuth (una vez)

En [Google Cloud Console](https://console.cloud.google.com/) → APIs y servicios → Credenciales → ID de cliente OAuth (tipo **Aplicación web**). Mientras la app esté en modo de prueba, agregue el correo del docente (y de un estudiante de prueba) en **Usuarios de prueba**.

| Entorno | Orígenes JavaScript | URI de redirección |
|---|---|---|
| Local | `http://localhost:3000` | `http://localhost:3000/api/auth/callback/google` |
| Producción | `https://agente-estadistica-i.srv1825081.hstgr.cloud` | `https://agente-estadistica-i.srv1825081.hstgr.cloud/api/auth/callback/google` |

## Variables

| Variable | Uso |
|---|---|
| `NEXOROUTER_API_KEY` | Modelo |
| `NEXOROUTER_MODEL` | Opcional; por defecto `kimi-k2.6` |
| `AUTH_SECRET` | Firma de la sesión (obligatorio en producción) |
| `AUTH_URL` | URL pública del aula |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth de Google (`AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` también sirven) |
| `TEACHER_EMAILS` | Correos Google del docente, separados por coma |
| `ALLOWED_EMAIL_DOMAINS` | Por defecto `est.umss.edu,umss.edu.bo,umss.edu` |
| `AULA_DB_PATH` | SQLite del aula; por defecto `.eve/.workflow-data/aula.sqlite` |

No subas `.env` ni `.env.local` a GitHub.

## Producción (VPS)

```bash
cd /docker/agente-estadistica-i
git fetch origin
git checkout main
git pull origin main
docker compose up --build -d
```

El volumen Docker `eve_workflow` guarda el estado del aula y los estudiantes junto a los datos de Eve.

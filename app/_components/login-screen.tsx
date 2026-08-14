import { signInWithGoogle } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";

const ERROR_MESSAGES: Record<string, string> = {
  dominio:
    "Use su correo institucional UMSS de Google (@est.umss.edu). La cuenta Microsoft @ms.umss.edu no sirve para este ingreso.",
  unverified: "Verifique su correo de Google e intente de nuevo.",
  email: "Google no devolvió un correo. Elija otra cuenta institucional.",
  docente:
    "Este aula es del Docente Mgr Alfredo Delgadillo Cossio. Otros correos de docentes no entran. Si es estudiante, use @est.umss.edu.",
  Configuration: "El aula aún no tiene configurado el acceso con Google.",
  OAuthCallback: "Google rechazó el inicio de sesión. Intente otra vez.",
};

function errorText(code: string | undefined): string | undefined {
  if (code === undefined || code.length === 0) {
    return undefined;
  }
  return ERROR_MESSAGES[code] ?? "No se pudo iniciar sesión. Intente de nuevo.";
}

export function LoginScreen({ error }: { error?: string }) {
  const message = errorText(error);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 pb-[10vh] text-foreground">
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <p className="text-muted-foreground text-sm tracking-wide">
          UMSS · FCyT · Ingeniería Civil e Informática
        </p>
        <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
          Probabilidad y Estadística
        </h1>
        <p className="text-muted-foreground text-base">Docente Mgr Alfredo Delgadillo Cossio</p>
        <p className="max-w-sm text-muted-foreground text-sm">
          Entre con su correo institucional de Google Workspace UMSS (
          <span className="font-medium text-foreground">@est.umss.edu</span>). El correo Microsoft
          @ms.umss.edu no abre esta aula.
        </p>
        {message ? (
          <p className="w-full rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
            {message}
          </p>
        ) : null}
        <form action={signInWithGoogle} className="w-full">
          <Button className="w-full" size="lg" type="submit">
            <GoogleMark />
            Entrar con Google institucional
          </Button>
        </form>
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

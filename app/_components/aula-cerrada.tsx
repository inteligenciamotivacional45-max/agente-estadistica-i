import { signOutAction } from "@/app/auth-actions";
import { SessionBar } from "@/app/_components/session-bar";
import { Button } from "@/components/ui/button";
import type { ClassroomUser } from "@/agent/lib/session";

export function AulaCerrada({
  notice,
  user,
}: {
  notice: string;
  user: ClassroomUser;
}) {
  return (
    <main className="flex min-h-dvh flex-col bg-background text-foreground">
      <SessionBar user={user} />
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-[10vh]">
        <div className="flex w-full max-w-md flex-col items-center gap-5 text-center">
          <p className="text-muted-foreground text-sm tracking-wide">
            UMSS · FCyT · Ingeniería Civil e Informática
          </p>
          <h1 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
            El aula está cerrada
          </h1>
          <p className="max-w-sm text-muted-foreground text-base">{notice}</p>
          <form action={signOutAction}>
            <Button type="submit" variant="outline">
              Salir
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

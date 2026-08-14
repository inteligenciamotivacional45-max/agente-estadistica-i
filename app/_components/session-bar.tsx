import Link from "next/link";
import { signOutAction } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import type { ClassroomUser } from "@/agent/lib/session";

export function SessionBar({
  user,
  current = "aula",
}: {
  user: ClassroomUser;
  current?: "aula" | "docente";
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/70 bg-background px-4 sm:px-6">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{user.name ?? "Sesión UMSS"}</p>
        <p className="truncate text-muted-foreground text-xs">{user.email}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {user.role === "teacher" ? (
          current === "docente" ? (
            <Button asChild size="sm" variant="ghost">
              <Link href="/">Ir al chat</Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="ghost">
              <Link href="/docente">Panel docente</Link>
            </Button>
          )
        ) : null}
        <form action={signOutAction}>
          <Button size="sm" type="submit" variant="outline">
            Salir
          </Button>
        </form>
      </div>
    </header>
  );
}

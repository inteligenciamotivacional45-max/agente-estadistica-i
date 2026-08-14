import { redirect } from "next/navigation";
import { SessionBar } from "@/app/_components/session-bar";
import { saveAulaNotice, toggleAula } from "@/app/docente/actions";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getAulaState, listStudents } from "@/agent/lib/aula";
import { classroomRole } from "@/agent/lib/umss";

export const dynamic = "force-dynamic";

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("es-BO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function DocentePage() {
  const session = await auth();
  if (session?.user?.email === undefined) {
    redirect("/");
  }

  const user = {
    email: session.user.email,
    name: session.user.name ?? null,
    role: session.user.role ?? classroomRole(session.user.email),
  };

  if (user.role !== "teacher") {
    redirect("/");
  }

  const aula = getAulaState();
  const students = listStudents();

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <SessionBar current="docente" user={user} />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-sm tracking-wide">Panel docente</p>
          <h1 className="font-serif text-3xl font-medium tracking-tight">Habilitar el aula</h1>
          <p className="text-muted-foreground text-sm">
            Abra el agente durante el periodo de clase. Al cerrar el aula, el chat se detiene
            para todos, incluido usted. Los estudiantes verán el aviso.
          </p>
        </div>

        <section className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h2 className="font-medium">Estado</h2>
                <Badge variant={aula.isOpen ? "default" : "secondary"}>
                  {aula.isOpen ? "Abierta" : "Cerrada"}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                Último cambio: {formatWhen(aula.updatedAt)}
                {aula.updatedBy ? ` · ${aula.updatedBy}` : ""}
              </p>
            </div>
            <form
              action={async () => {
                "use server";
                await toggleAula(!aula.isOpen);
              }}
            >
              <Button type="submit" variant={aula.isOpen ? "destructive" : "default"}>
                {aula.isOpen ? "Cerrar aula" : "Abrir aula"}
              </Button>
            </form>
          </div>

          <form action={saveAulaNotice} className="flex flex-col gap-3">
            <label className="text-sm font-medium" htmlFor="notice">
              Aviso para estudiantes
            </label>
            <Textarea
              defaultValue={aula.notice}
              id="notice"
              name="notice"
              rows={4}
              placeholder="El aula abre en la siguiente clase."
            />
            <div>
              <Button type="submit" variant="outline">
                Guardar aviso
              </Button>
            </div>
          </form>
        </section>

        <section className="flex flex-col gap-4">
          <div>
            <h2 className="font-medium">Estudiantes registrados</h2>
            <p className="text-muted-foreground text-sm">
              {students.length === 1
                ? "1 estudiante ha entrado con Google institucional."
                : `${students.length} estudiantes han entrado con Google institucional.`}
            </p>
          </div>
          {students.length === 0 ? (
            <p className="rounded-xl border bg-card px-4 py-6 text-center text-muted-foreground text-sm">
              Todavía no hay registros. Aparecerán aquí al primer ingreso.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border bg-card">
              <table className="w-full text-left text-sm">
                <thead className="border-b text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nombre</th>
                    <th className="px-4 py-3 font-medium">Correo</th>
                    <th className="px-4 py-3 font-medium">Última visita</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr className="border-b last:border-0" key={student.email}>
                      <td className="px-4 py-3">{student.name}</td>
                      <td className="px-4 py-3">{student.email}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatWhen(student.lastSeen)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

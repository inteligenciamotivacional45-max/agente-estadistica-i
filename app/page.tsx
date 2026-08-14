import { AgentChat } from "@/app/_components/agent-chat";
import { AulaCerrada } from "@/app/_components/aula-cerrada";
import { LoginScreen } from "@/app/_components/login-screen";
import { SessionBar } from "@/app/_components/session-bar";
import { auth } from "@/auth";
import { closedAulaMessage, getAulaState, recordStudentVisit } from "@/agent/lib/aula";
import { classroomRole } from "@/agent/lib/umss";

export const dynamic = "force-dynamic";

function firstSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const error = firstSearchParam(params.error);

  if (session?.user?.email === undefined) {
    return <LoginScreen error={error} />;
  }

  const user = {
    email: session.user.email,
    name: session.user.name ?? null,
    role: session.user.role ?? classroomRole(session.user.email),
  };
  if (user.role === "student") {
    recordStudentVisit(user.email, user.name);
  }
  const aula = getAulaState();

  if (!aula.isOpen) {
    return <AulaCerrada notice={closedAulaMessage(aula)} user={user} />;
  }

  return (
    <AgentChat>
      <SessionBar user={user} />
    </AgentChat>
  );
}

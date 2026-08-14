import { auth } from "@/auth";
import { closedAulaMessage, getAulaState } from "@/agent/lib/aula";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (session?.user?.email === undefined) {
    return Response.json({ ok: false, isOpen: false }, { status: 401 });
  }

  const aula = getAulaState();
  return Response.json({
    ok: true,
    isOpen: aula.isOpen,
    notice: closedAulaMessage(aula),
  });
}

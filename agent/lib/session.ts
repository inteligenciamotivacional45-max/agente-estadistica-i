import { getToken } from "next-auth/jwt";
import { classroomRole, type ClassroomRole } from "./umss";

export type ClassroomUser = {
  email: string;
  name: string | null;
  role: ClassroomRole;
};

function isSecureRequest(request: Request): boolean {
  const forwarded = request.headers.get("x-forwarded-proto");
  if (forwarded !== null) {
    return forwarded.split(",")[0]?.trim() === "https";
  }

  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return process.env.AUTH_URL?.startsWith("https://") === true;
  }
}

function hasCookie(header: string, name: string): boolean {
  return header.split(";").some((part) => part.trim().startsWith(`${name}=`));
}

export async function getClassroomUser(request: Request): Promise<ClassroomUser | null> {
  const secret = process.env.AUTH_SECRET;
  if (secret === undefined || secret.length === 0) {
    return null;
  }

  const cookieHeader = request.headers.get("cookie") ?? "";
  const secureCookie =
    hasCookie(cookieHeader, "__Secure-authjs.session-token") || isSecureRequest(request);

  const token = await getToken({
    req: request,
    secret,
    secureCookie,
  });

  if (token === null) {
    return null;
  }

  const email = token.email?.trim().toLowerCase();
  if (email === undefined || email.length === 0) {
    return null;
  }

  return {
    email,
    name: typeof token.name === "string" ? token.name : null,
    role: classroomRole(email),
  };
}

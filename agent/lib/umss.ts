const DEFAULT_ALLOWED_DOMAINS = ["est.umss.edu", "umss.edu.bo", "umss.edu"] as const;

export type ClassroomRole = "teacher" | "student";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function emailDomain(email: string): string {
  const normalized = normalizeEmail(email);
  const at = normalized.lastIndexOf("@");
  if (at <= 0 || at === normalized.length - 1) {
    return "";
  }
  return normalized.slice(at + 1);
}

export function parseEmailList(value: string | undefined): string[] {
  if (value === undefined || value.trim().length === 0) {
    return [];
  }

  return value
    .split(/[,;\s]+/)
    .map((entry) => normalizeEmail(entry))
    .filter((entry) => entry.includes("@"));
}

export function allowedEmailDomains(value = process.env.ALLOWED_EMAIL_DOMAINS): string[] {
  if (value === undefined || value.trim().length === 0) {
    return [...DEFAULT_ALLOWED_DOMAINS];
  }

  return value
    .split(/[,;\s]+/)
    .map((entry) => entry.trim().toLowerCase().replace(/^@/, ""))
    .filter((entry) => entry.includes("."));
}

export function isAllowedUmssDomain(domain: string, allowed = allowedEmailDomains()): boolean {
  const host = domain.trim().toLowerCase();
  if (host.length === 0) {
    return false;
  }

  return allowed.some((entry) => host === entry || host.endsWith(`.${entry}`));
}

export function isUmssEmail(email: string, allowed = allowedEmailDomains()): boolean {
  return isAllowedUmssDomain(emailDomain(email), allowed);
}

export function teacherEmails(value = process.env.TEACHER_EMAILS): string[] {
  return parseEmailList(value);
}

export function isTeacherEmail(email: string, teachers = teacherEmails()): boolean {
  return teachers.includes(normalizeEmail(email));
}

export function classroomRole(email: string, teachers = teacherEmails()): ClassroomRole {
  return isTeacherEmail(email, teachers) ? "teacher" : "student";
}

export function canSignIn(
  email: string,
  emailVerified = true,
  teachers = teacherEmails(),
  allowed = allowedEmailDomains(),
): boolean {
  if (!emailVerified) {
    return false;
  }

  return isTeacherEmail(email, teachers) || isUmssEmail(email, allowed);
}

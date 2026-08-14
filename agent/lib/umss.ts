const DEFAULT_ALLOWED_DOMAINS = ["est.umss.edu"] as const;

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
  const listed = parseEmailList(value);
  return listed.slice(0, 1);
}

export function isTeacherEmail(email: string, teachers = teacherEmails()): boolean {
  return teachers.includes(normalizeEmail(email));
}

export function classroomRole(email: string, teachers = teacherEmails()): ClassroomRole {
  return isTeacherEmail(email, teachers) ? "teacher" : "student";
}

function isStudentWorkspaceDomain(domain: string): boolean {
  const host = domain.trim().toLowerCase();
  return host === "est.umss.edu" || host.endsWith(".est.umss.edu");
}

function isUmssStaffDomain(domain: string): boolean {
  const host = domain.trim().toLowerCase();
  if (host.length === 0 || isStudentWorkspaceDomain(host)) {
    return false;
  }

  return (
    host === "umss.edu" ||
    host === "umss.edu.bo" ||
    host.endsWith(".umss.edu") ||
    host.endsWith(".umss.edu.bo")
  );
}

export function isOtherFacultyEmail(
  email: string,
  teachers = teacherEmails(),
): boolean {
  if (isTeacherEmail(email, teachers)) {
    return false;
  }

  return isUmssStaffDomain(emailDomain(email));
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

  if (isTeacherEmail(email, teachers)) {
    return true;
  }

  // Other UMSS faculty never enter as students, even if their domain is listed.
  if (isOtherFacultyEmail(email, teachers)) {
    return false;
  }

  return isUmssEmail(email, allowed);
}

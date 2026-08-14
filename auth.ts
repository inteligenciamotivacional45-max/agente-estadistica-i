import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { recordStudentVisit } from "@/agent/lib/aula";
import { canSignIn, classroomRole, isTeacherEmail } from "@/agent/lib/umss";

function googleClientId(): string | undefined {
  return process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID;
}

function googleClientSecret(): string | undefined {
  return process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET;
}

function googleEmailVerified(profile: unknown): boolean | undefined {
  if (typeof profile !== "object" || profile === null || !("email_verified" in profile)) {
    return undefined;
  }

  const value = (profile as { email_verified?: unknown }).email_verified;
  return typeof value === "boolean" ? value : undefined;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: googleClientId(),
      clientSecret: googleClientSecret(),
    }),
  ],
  pages: {
    signIn: "/",
    error: "/",
  },
  callbacks: {
    async signIn({ user, profile }) {
      const email = user.email;
      if (email === null || email === undefined || email.trim().length === 0) {
        return "/?error=email";
      }

      const verified = googleEmailVerified(profile);
      if (verified === false) {
        return "/?error=unverified";
      }

      if (!canSignIn(email)) {
        return "/?error=dominio";
      }

      if (!isTeacherEmail(email)) {
        recordStudentVisit(email, user.name);
      }

      return true;
    },
    jwt({ token, user }) {
      const email = user?.email ?? token.email;
      if (typeof email === "string" && email.length > 0) {
        token.email = email;
        token.role = classroomRole(email);
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.email === "string") {
        session.user.email = token.email;
        session.user.role = token.role === "teacher" ? "teacher" : "student";
      }
      return session;
    },
  },
});

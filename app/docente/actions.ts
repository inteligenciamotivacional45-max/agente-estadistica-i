"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { setAulaNotice, setAulaOpen } from "@/agent/lib/aula";

async function requireTeacherEmail(): Promise<string> {
  const session = await auth();
  const email = session?.user?.email;
  if (session?.user?.role !== "teacher" || email === undefined) {
    throw new Error("Solo el docente puede cambiar el aula.");
  }
  return email;
}

export async function toggleAula(isOpen: boolean): Promise<void> {
  const email = await requireTeacherEmail();
  setAulaOpen(isOpen, email);
  revalidatePath("/");
  revalidatePath("/docente");
}

export async function saveAulaNotice(formData: FormData): Promise<void> {
  const email = await requireTeacherEmail();
  const notice = String(formData.get("notice") ?? "");
  setAulaNotice(notice, email);
  revalidatePath("/");
  revalidatePath("/docente");
}

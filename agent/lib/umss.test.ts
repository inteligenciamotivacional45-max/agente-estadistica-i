import assert from "node:assert/strict";
import { test } from "node:test";
import {
  canSignIn,
  classroomRole,
  emailDomain,
  isAllowedUmssDomain,
  isOtherFacultyEmail,
  isTeacherEmail,
  isUmssEmail,
  parseEmailList,
  teacherEmails,
} from "./umss.ts";

test("students must use Google Workspace @est.umss.edu", () => {
  const allowed = ["est.umss.edu"];
  assert.equal(isUmssEmail("207100125@est.umss.edu", allowed), true);
  assert.equal(isUmssEmail("docente@umss.edu.bo", allowed), false);
  assert.equal(isUmssEmail("alguien@fcyt.umss.edu.bo", allowed), false);
  assert.equal(isUmssEmail("nombre.apellido@umss.edu", allowed), false);
});

test("rejects personal and lookalike domains", () => {
  const allowed = ["est.umss.edu"];
  assert.equal(isUmssEmail("alumno@gmail.com", allowed), false);
  assert.equal(isUmssEmail("falso@est.umss.edu.evil.com", allowed), false);
  assert.equal(isUmssEmail("sin-arroba", allowed), false);
  assert.equal(isAllowedUmssDomain("", allowed), false);
});

test("only the first TEACHER_EMAILS entry is the course teacher", () => {
  assert.deepEqual(teacherEmails("d.delgadillo@umss.edu, otro@umss.edu.bo"), [
    "d.delgadillo@umss.edu",
  ]);
  const teachers = teacherEmails("d.delgadillo@umss.edu, otro@umss.edu.bo");
  assert.equal(isTeacherEmail("d.delgadillo@umss.edu", teachers), true);
  assert.equal(isTeacherEmail("otro@umss.edu.bo", teachers), false);
  assert.equal(classroomRole("otro@umss.edu.bo", teachers), "student");
  assert.equal(canSignIn("otro@umss.edu.bo", true, teachers, ["est.umss.edu"]), false);
  assert.equal(canSignIn("d.delgadillo@umss.edu", true, teachers, ["est.umss.edu"]), true);
  assert.equal(canSignIn("207100125@est.umss.edu", true, teachers, ["est.umss.edu"]), true);
});

test("other faculty emails are flagged and cannot sign in", () => {
  const teachers = ["d.delgadillo@umss.edu"];
  const allowed = ["est.umss.edu"];
  assert.equal(isOtherFacultyEmail("coleg@umss.edu.bo", teachers), true);
  assert.equal(isOtherFacultyEmail("nombre.apellido@umss.edu", teachers), true);
  assert.equal(isOtherFacultyEmail("alguien@fcyt.umss.edu.bo", teachers), true);
  assert.equal(isOtherFacultyEmail("d.delgadillo@umss.edu", teachers), false);
  assert.equal(isOtherFacultyEmail("207100125@est.umss.edu", teachers), false);
  assert.equal(canSignIn("coleg@umss.edu.bo", true, teachers, allowed), false);
  assert.equal(canSignIn("nombre.apellido@umss.edu", true, teachers, allowed), false);
});

test("other faculty stay blocked even if ALLOWED_EMAIL_DOMAINS lists umss.edu", () => {
  const teachers = ["d.delgadillo@umss.edu"];
  const allowed = ["est.umss.edu", "umss.edu.bo", "umss.edu"];
  assert.equal(canSignIn("coleg@umss.edu", true, teachers, allowed), false);
  assert.equal(canSignIn("coleg@umss.edu.bo", true, teachers, allowed), false);
  assert.equal(canSignIn("d.delgadillo@umss.edu", true, teachers, allowed), true);
  assert.equal(canSignIn("207100125@est.umss.edu", true, teachers, allowed), true);
});

test("parses comma-separated emails and reads domains", () => {
  assert.deepEqual(parseEmailList("a@x.com, b@y.com;c@z.com"), ["a@x.com", "b@y.com", "c@z.com"]);
  assert.equal(emailDomain("Nombre@EST.UMSS.EDU"), "est.umss.edu");
});

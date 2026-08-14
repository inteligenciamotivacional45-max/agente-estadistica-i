import assert from "node:assert/strict";
import { test } from "node:test";
import {
  canSignIn,
  classroomRole,
  emailDomain,
  isAllowedUmssDomain,
  isTeacherEmail,
  isUmssEmail,
  parseEmailList,
} from "./umss.ts";

test("accepts UMSS Google Workspace and faculty domains", () => {
  const allowed = ["est.umss.edu", "umss.edu.bo", "umss.edu"];
  assert.equal(isUmssEmail("207100125@est.umss.edu", allowed), true);
  assert.equal(isUmssEmail("docente@umss.edu.bo", allowed), true);
  assert.equal(isUmssEmail("alguien@fcyt.umss.edu.bo", allowed), true);
  assert.equal(isUmssEmail("nombre.apellido@umss.edu", allowed), true);
});

test("rejects personal and lookalike domains", () => {
  const allowed = ["est.umss.edu", "umss.edu.bo", "umss.edu"];
  assert.equal(isUmssEmail("alumno@gmail.com", allowed), false);
  assert.equal(isUmssEmail("falso@umss.edu.bo.evil.com", allowed), false);
  assert.equal(isUmssEmail("sin-arroba", allowed), false);
  assert.equal(isAllowedUmssDomain("", allowed), false);
});

test("teachers may use any listed Google account", () => {
  const teachers = ["alfred@gmail.com", "docente@umss.edu.bo"];
  assert.equal(isTeacherEmail("Alfred@Gmail.com", teachers), true);
  assert.equal(classroomRole("alfred@gmail.com", teachers), "teacher");
  assert.equal(canSignIn("alfred@gmail.com", true, teachers), true);
  assert.equal(canSignIn("visitante@gmail.com", true, teachers), false);
  assert.equal(canSignIn("207100125@est.umss.edu", true, teachers), true);
  assert.equal(canSignIn("207100125@est.umss.edu", false, teachers), false);
});

test("parses comma-separated emails and reads domains", () => {
  assert.deepEqual(parseEmailList("a@x.com, b@y.com;c@z.com"), ["a@x.com", "b@y.com", "c@z.com"]);
  assert.equal(emailDomain("Nombre@EST.UMSS.EDU"), "est.umss.edu");
});

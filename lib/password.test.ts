import { hashPassword, verifyPassword } from "./password.ts";

import { assertEquals } from "@std/assert";

const pass = "P@s$w0rd";

Deno.test("verifyPassword() returns true when password matches", () => {
  const hashed = hashPassword(pass);

  const result = verifyPassword(pass, hashed);

  assertEquals(result, true);
});

Deno.test("verifyPassword() returns false when password doesn't match", () => {
  const hashed = hashPassword(pass);

  const result = verifyPassword("P@ssw0rd", hashed);

  assertEquals(result, false);
});

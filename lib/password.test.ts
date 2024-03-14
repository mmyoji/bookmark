import { assertEquals } from "@std/assert";

import { hashPassword, verifyPassword } from "@/lib/password.ts";

const pswd = "P@s$w0rd";

Deno.test("verifyPassword() returns true when password matches", () => {
  const hashed = hashPassword(pswd);

  const result = verifyPassword(pswd, hashed);

  assertEquals(result, true);
});

Deno.test("verifyPassword() returns false when password unmatches", () => {
  const hashed = hashPassword(pswd);

  const result = verifyPassword("P@ssw0rd", hashed);

  assertEquals(result, false);
});

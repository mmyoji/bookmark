import { assertEquals } from "$std/testing/asserts.ts";

import { hashPassword, verifyPassword } from "@/lib/password.ts";

const pswd = "P@s$w0rd";

Deno.test("verifyPassword() returns true when password matches", async () => {
  const encryptedPassword = await hashPassword(pswd);

  const result = await verifyPassword(pswd, encryptedPassword);

  assertEquals(result, true);
});

Deno.test("verifyPassword() returns false when password unmatches", async () => {
  const encryptedPassword = await hashPassword(pswd);

  const result = await verifyPassword("P@ssw0rd", encryptedPassword);

  assertEquals(result, false);
});

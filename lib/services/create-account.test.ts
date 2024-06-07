import { createAccount } from "./create-account.ts";

import { kvHelper } from "@/lib/kv/_test-helpers.ts";
import { assertEquals, assertNotEquals } from "@std/assert";

const username = "test-user";

Deno.test("createAccount() returns error with invalid credentials", async () => {
  const { error } = await createAccount({ username, password: " " });

  assertEquals(error, "username and/or password is invalid");
  assertEquals(await kvHelper.login.findOne({ username }), null);
});

Deno.test("createAccount() returns no error with valid credentials", async () => {
  const { error } = await createAccount({ username, password: "P@s$w0rd" });

  assertEquals(error, "");
  assertNotEquals(await kvHelper.login.findOne({ username }), null);

  await kvHelper.login.deleteAll();
});

import { userRegistrationService } from "@/lib/services/user-registration.ts";

import { assertEquals, assertNotEquals } from "$std/assert/mod.ts";

import { kvHelper } from "@/lib/kv/_test-helpers.ts";

const username = "test-user";

Deno.test("userRegistrationService.run() returns error with invalid credentials", async () => {
  const { error } = await userRegistrationService.run({
    username,
    password: " ",
  });

  assertEquals(error, "username and/or password is invalid");
  assertEquals(await kvHelper.login.findOne({ username }), null);
});

Deno.test("userRegistrationService.run() returns no error with valid credentials", async () => {
  const { error } = await userRegistrationService.run({
    username,
    password: "P@s$w0rd",
  });

  assertEquals(error, null);
  assertNotEquals(await kvHelper.login.findOne({ username }), null);

  await kvHelper.login.deleteAll();
});

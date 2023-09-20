import { assertEquals } from "$std/assert/mod.ts";

import { kv } from "@/lib/db/_kv.ts";
import { kvHelper } from "@/lib/db/_test-helpers.ts";
import { createLogin, findLogin } from "@/lib/db/logins.kv.ts";

Deno.test("createLogin() saves data", async () => {
  const data = {
    username: crypto.randomUUID(),
    hashedPassword: "password",
  };
  await createLogin(data);

  const res = await kv.get<typeof data>(["logins", data.username]);

  assertEquals(res.value, data);

  await kvHelper.login.deleteAll();
});

Deno.test("findLogin() fetches by username", async () => {
  const data = {
    username: crypto.randomUUID(),
    hashedPassword: "password",
  };
  await createLogin(data);

  {
    const login = await findLogin(data.username);
    assertEquals(login, data);
  }

  {
    const login = await findLogin(crypto.randomUUID());
    assertEquals(login, null);
  }

  await kvHelper.login.deleteAll();
});

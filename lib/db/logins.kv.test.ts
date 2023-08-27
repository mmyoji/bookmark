import { assertEquals } from "$std/assert/mod.ts";

import { createLogin, findLogin } from "@/lib/db/logins.kv.ts";
import { kv } from "@/lib/db/kv.ts";

async function teardown() {
  for await (const entry of kv.list({ prefix: ["logins"] })) {
    await kv.delete(entry.key);
  }
}

Deno.test("createLogin() saves data", async () => {
  const data = {
    username: crypto.randomUUID(),
    hashedPassword: "password",
  };
  await createLogin(data);

  const res = await kv.get<typeof data>(["logins", data.username]);

  assertEquals(res.value, data);

  await teardown();
});

Deno.test("findLogin() fetches by username", async () => {
  const data = {
    username: crypto.randomUUID(),
    hashedPassword: "password",
  };
  await createLogin(data);

  let login = await findLogin(data.username);
  assertEquals(login, data);

  login = await findLogin(crypto.randomUUID());
  assertEquals(login, null);

  await teardown();
});

import { assertEquals } from "$std/testing/asserts.ts";

import { createLogin, findLogin } from "@/lib/db/logins.kv.ts";
import { KV, testKV } from "@/lib/db/kv.ts";

async function teardown(kv: KV) {
  for await (const entry of kv.list({ prefix: ["logins"] })) {
    await kv.delete(entry.key);
  }
}

testKV("createLogin() saves data", async (kv) => {
  const data = {
    username: crypto.randomUUID(),
    hashedPassword: "password",
  };
  await createLogin(data)(kv);

  const res = await kv.get<typeof data>(["logins", data.username]);

  assertEquals(res.value, data);

  await teardown(kv);
});

testKV("findLogin() fetches by username", async (kv) => {
  const data = {
    username: crypto.randomUUID(),
    hashedPassword: "password",
  };
  await createLogin(data)(kv);

  let login = await findLogin(data.username)(kv);
  assertEquals(login, data);

  login = await findLogin(crypto.randomUUID())(kv);
  assertEquals(login, null);

  await teardown(kv);
});

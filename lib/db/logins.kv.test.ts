import { assertEquals } from "$std/testing/asserts.ts";

import { createLogin, findLogin } from "@/lib/db/logins.kv.ts";
import { initTestKV, KV } from "@/lib/db/kv.ts";

function testDB(
  desc: string,
  fn: (kv: KV) => Promise<void>,
): void {
  Deno.test(desc, async () => {
    const kv = await initTestKV();
    await fn(kv);

    for await (const entry of kv.list({ prefix: ["logins"] })) {
      await kv.delete(entry.key);
    }
    await kv.close();
  });
}

testDB("createLogin() saves data", async (kv) => {
  const data = {
    username: crypto.randomUUID(),
    encryptedPassword: "password",
  };
  await createLogin(data)(kv);

  const res = await kv.get<typeof data>(["logins", data.username]);

  assertEquals(res.value, data);
});

testDB("findLogin() fetches by username", async (kv) => {
  const data = {
    username: crypto.randomUUID(),
    encryptedPassword: "password",
  };
  await createLogin(data)(kv);

  let login = await findLogin(data.username)(kv);
  assertEquals(login, data);

  login = await findLogin(crypto.randomUUID())(kv);
  assertEquals(login, null);
});

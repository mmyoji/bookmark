import { assert, assertEquals } from "$std/testing/asserts.ts";

import { loginHeaders, origin, visit } from "@/tests/_helpers.ts";

Deno.test("GET /login without login", async () => {
  const resp = await visit(new Request(`${origin}/login`));

  assertEquals(resp.status, 200);
  const text = await resp.text();
  assert(text.includes("<title>Login - Archive Reminder</title>"));
});

Deno.test("GET /login with login", async () => {
  const { headers, teardown } = await loginHeaders();
  const resp = await visit(new Request(`${origin}/login`, { headers }));

  assertEquals(resp.status, 302);

  await teardown();
});

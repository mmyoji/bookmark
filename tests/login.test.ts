import { assert, assertEquals } from "@std/assert";

import { loginHeaders, origin, visit } from "@/tests/_helpers.ts";

Deno.test("GET /login without login", async () => {
  const res = await visit(new Request(`${origin}/login`));

  assertEquals(res.status, 200);
  const text = await res.text();
  assert(text.includes("<title>Login - Bookmark</title>"));
});

Deno.test("GET /login with login", async () => {
  const { headers, teardown } = await loginHeaders();
  const res = await visit(
    new Request(`${origin}/login`, { headers }),
  );

  assertEquals(res.status, 302);

  await teardown();
});

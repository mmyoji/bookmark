import { assert, assertEquals } from "$std/testing/asserts.ts";

import { loginHeaders, origin, visit } from "@/tests/_helpers.ts";

Deno.test("GET / without login", async () => {
  const resp = await visit(new Request(`${origin}/`));

  assertEquals(resp.status, 200);
  const text = await resp.text();
  assert(text.includes("<title>Bookmark</title>"));
  assert(!text.includes(">Sign out</a>"));
});

Deno.test("GET / with login", async () => {
  const { headers, teardown } = await loginHeaders();
  const resp = await visit(new Request(`${origin}/`, { headers }));

  assertEquals(resp.status, 200);
  const text = await resp.text();
  assert(text.includes("<title>Bookmark</title>"));
  assert(text.includes(">Sign out</a>"));

  await teardown();
});

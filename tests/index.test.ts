import { assert, assertEquals } from "@std/assert";

import { loginHeaders, origin, visit } from "@/tests/_helpers.ts";

Deno.test("GET / without login", async () => {
  const res = await visit(new Request(`${origin}/`));

  assertEquals(res.status, 200);
  const text = await res.text();
  assert(text.includes("<title>Bookmark</title>"));
  assert(!text.includes(">Sign out</a>"));
});

Deno.test("GET / with login", async () => {
  const { headers, teardown } = await loginHeaders();
  const res = await visit(new Request(`${origin}/`, { headers }));

  assertEquals(res.status, 200);
  const text = await res.text();
  assert(text.includes("<title>Bookmark</title>"));
  assert(text.includes(">Sign out</a>"));

  await teardown();
});

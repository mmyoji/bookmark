import { assert, assertEquals } from "$std/testing/asserts.ts";

import { origin, visit } from "@/tests/_helpers.ts";

Deno.test("GET / without login", async () => {
  const resp = await visit(new Request(`${origin}/`));

  assertEquals(resp.status, 200);
  const text = await resp.text();
  assert(text.includes("<title>Archive Reminder</title>"));
  assert(!text.includes(">Sign out</a>"));
});

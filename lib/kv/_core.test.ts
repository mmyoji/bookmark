import { assertEquals } from "$std/assert/mod.ts";

import { kv, list } from "@/lib/kv/_core.ts";

type TKey = [string, string];
type TVal = { val: number };

const DATA: [TKey, TVal][] = [
  [["test", "foo"], { val: 1 }],
  [["test", "bar"], { val: 2 }],
  [["test", "buz"], { val: 3 }],
  [["tes", "foo"], { val: 4 }],
  [["testt", "foo"], { val: 5 }],
];

async function setup() {
  for (const [key, val] of DATA) {
    await kv.set(key, val);
  }
}

async function teardown() {
  for (const [key] of DATA) {
    await kv.delete(key);
  }
}

Deno.test("kv.list() returns an array of objects and its cursor", async () => {
  await setup();

  const [data, cursor] = await list<TVal>([{ prefix: ["test"] }]);

  assertEquals(data, [
    { val: 2 },
    { val: 3 },
    { val: 1 },
  ]);
  assertEquals(cursor, "");

  await teardown();
});

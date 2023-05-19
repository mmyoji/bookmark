import { assertEquals } from "$std/testing/asserts.ts";

import { initTestKV, KV, list } from "@/lib/db/kv.ts";

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
  const kv = await initTestKV();

  for (const [key, val] of DATA) {
    await kv.set(key, val);
  }

  return kv;
}

async function teardown(kv: KV) {
  for (const [key] of DATA) {
    await kv.delete(key);
  }

  kv.close();
}

Deno.test("kv.list() returns an array of objects", async () => {
  const kv = await setup();

  const data = await list<TVal>([{ prefix: ["test"] }])(kv);

  assertEquals(data, [
    { val: 2 },
    { val: 3 },
    { val: 1 },
  ]);

  await teardown(kv);
});

import { assert, assertEquals } from "$std/testing/asserts.ts";

import {
  createItem,
  deleteItem,
  findItems,
  searchItems,
} from "@/lib/db/items.kv.ts";
import { initTestKV, KV } from "@/lib/db/kv.ts";

function testDB(
  desc: string,
  fn: (kv: KV) => Promise<void>,
): void {
  Deno.test(desc, async () => {
    const kv = await initTestKV();
    await fn(kv);

    for await (const entry of kv.list({ prefix: ["items"] })) {
      await kv.delete(entry.key);
    }
    kv.close();
  });
}

testDB("createItem() saves data", async (kv) => {
  const data = {
    date: "2023-05-04",
    url: "http://example.com",
    title: "Example Page",
  };
  await createItem(data)(kv);

  const res = await kv.get<typeof data>(["items", data.date, data.url]);

  assertEquals(res.value, {
    date: "2023-05-04",
    url: "http://example.com",
    title: "Example Page",
  });
});

testDB("deleteItem() deletes given key", async (kv) => {
  const data = {
    date: "2023-05-04",
    url: "http://example.com",
    title: "Example Page",
  };
  await createItem(data)(kv);

  await deleteItem({ date: data.date, url: data.url })(kv);

  const res = await kv.get(["items", data.date, data.url]);
  assertEquals(res.value, null);
});

const shuffle = <T>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

async function setupData(kv: KV) {
  const title = "Example Page";
  const url = "http://example.com";

  const dates = shuffle([
    "2023-03-01",
    "2023-03-02",

    "2023-03-11",
    "2023-03-21",
    "2023-03-31",
    "2023-10-01",
    "2023-10-11",

    "2023-11-01",
    "2023-11-02",
    "2023-11-30",
    "2023-12-01",
    "2023-12-02",

    "2023-12-03",
    "2023-12-10",
    "2023-12-11",
    "2023-12-21",
    "2023-12-31",
  ]);

  for (const date of dates) {
    await createItem({ date, title, url })(kv);
  }
}

testDB(
  "findItems() returns limited number of items in desc order",
  async (kv) => {
    await setupData(kv);

    let [items, cursor] = await findItems(undefined)(kv);

    assertEquals(items.length, 10);
    assertEquals(items[0].date, "2023-12-31");
    assertEquals(items[9].date, "2023-11-01");
    assert(cursor !== "");

    [items, cursor] = await findItems(cursor)(kv);

    assertEquals(items.length, 7);
    assertEquals(items[0].date, "2023-10-11");
    assertEquals(items[6].date, "2023-03-01");
    assertEquals(cursor, "");
  },
);

testDB(
  "searchItems() returns target date of items",
  async (kv) => {
    const data = [
      {
        date: "2023-01-01",
        title: "test 1",
        url: "http://example.com",
      },
      {
        date: "2023-01-01",
        title: "test 2",
        url: "http://example.com/foo",
      },
      {
        date: "2023-01-02",
        title: "test 1",
        url: "http://example.com",
      },
      {
        date: "2023-01-02",
        title: "test 2",
        url: "http://example.com/foo",
      },
      {
        date: "2023-01-10",
        title: "test 1",
        url: "http://example.com",
      },
      {
        date: "2023-01-10",
        title: "test 2",
        url: "http://example.com/foo",
      },
    ];
    for (const d of data) {
      await createItem(d)(kv);
    }

    const items = await searchItems("2023-01-02")(kv);

    assertEquals(items.length, 2);
    assertEquals(items, [
      {
        date: "2023-01-02",
        title: "test 1",
        url: "http://example.com",
      },
      {
        date: "2023-01-02",
        title: "test 2",
        url: "http://example.com/foo",
      },
    ]);
  },
);

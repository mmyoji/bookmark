import { assert, assertEquals } from "$std/assert/mod.ts";

import {
  createItem,
  deleteItem,
  findItems,
  searchItems,
} from "@/lib/db/items.kv.ts";
import { KV, testKV } from "@/lib/db/kv.ts";

async function teardown(kv: KV) {
  for await (const entry of kv.list({ prefix: ["items"] })) {
    await kv.delete(entry.key);
  }
}

testKV("createItem() saves data", async (kv) => {
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

  await teardown(kv);
});

testKV("deleteItem() deletes given key", async (kv) => {
  const data = {
    date: "2023-05-04",
    url: "http://example.com",
    title: "Example Page",
  };
  await createItem(data)(kv);

  await deleteItem({ date: data.date, url: data.url })(kv);

  const res = await kv.get(["items", data.date, data.url]);
  assertEquals(res.value, null);

  await teardown(kv);
});

const shuffle = <T>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

async function setupData(kv: KV) {
  const title = "Example Page";
  const url = "http://example.com";

  const dates = shuffle([
    "2023-03-01",
    "2023-03-02",
    "2023-03-03",
    "2023-03-04",
    "2023-03-05",

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

    "2024-01-02",
    "2024-01-03",
  ]);

  for (const date of dates) {
    await createItem({ date, title, url })(kv);
  }
}

testKV(
  "findItems() returns limited number of items in desc order",
  async (kv) => {
    await setupData(kv);

    let [items, cursor] = await findItems(undefined)(kv);

    assertEquals(items.length, 20);
    assertEquals(items[0].date, "2024-01-03");
    assertEquals(items[19].date, "2023-03-03");
    assert(cursor !== "");

    [items, cursor] = await findItems(cursor)(kv);

    assertEquals(items.length, 2);
    assertEquals(items[0].date, "2023-03-02");
    assertEquals(items[1].date, "2023-03-01");
    assertEquals(cursor, "");

    await teardown(kv);
  },
);

testKV(
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

    await teardown(kv);
  },
);

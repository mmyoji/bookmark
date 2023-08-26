import { assert, assertEquals } from "$std/assert/mod.ts";

import {
  createItem,
  deleteItem,
  findItems,
  Item,
  searchItems,
} from "@/lib/db/items.kv.ts";
import { KV } from "@/lib/db/kv.ts";
import { testKV } from "@/lib/db/test.helpers.ts";

async function teardown(kv: KV) {
  for await (const entry of kv.list({ prefix: ["items"] })) {
    await kv.delete(entry.key);
  }
}

testKV("createItem() saves data", async (kv) => {
  const date = "2023-05-04";
  const dateISO = `${date}T10:00:00.000Z`;
  await createItem({
    date: new Date(dateISO),
    url: "http://example.com",
    title: "Example Page",
  })(kv);

  const res = await kv.get<Item>(["items", date, dateISO]);

  assertEquals(res.value, {
    date,
    dateISO,
    url: "http://example.com",
    title: "Example Page",
  });

  await teardown(kv);
});

testKV("deleteItem() deletes given key", async (kv) => {
  const date = "2023-05-04";
  const dateISO = `${date}T10:00:00.000Z`;
  await createItem({
    date: new Date(dateISO),
    url: "http://example.com",
    title: "Example Page",
  })(kv);

  await deleteItem(dateISO)(kv);

  const res = await kv.get(["items", date, dateISO]);
  assertEquals(res.value, null);

  await teardown(kv);
});

const shuffle = <T>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

async function setupData(kv: KV) {
  const title = "Example Page";
  const url = "http://example.com";

  const dateISOs = shuffle([
    "2023-03-01T10:00:00.000Z",
    "2023-03-01T11:00:00.000Z",
    "2023-03-02T09:00:00.000Z",
    "2023-03-02T10:00:00.000Z",
    "2023-03-03T10:00:00.000Z",
    "2023-03-04T10:00:00.000Z",
    "2023-03-05T10:00:00.000Z",
    "2023-03-11T10:00:00.000Z",
    "2023-03-21T10:00:00.000Z",
    "2023-03-31T10:00:00.000Z",
    "2023-10-01T10:00:00.000Z",
    "2023-10-11T10:00:00.000Z",
    "2023-11-01T10:00:00.000Z",
    "2023-11-02T10:00:00.000Z",
    "2023-11-30T10:00:00.000Z",
    "2023-12-01T10:00:00.000Z",
    "2023-12-02T10:00:00.000Z",
    "2023-12-03T10:00:00.000Z",
    "2023-12-10T10:00:00.000Z",
    "2023-12-10T10:00:10.000Z",
    "2023-12-11T10:00:00.000Z",
    "2023-12-11T10:01:00.000Z",
  ]);

  for (const dateISO of dateISOs) {
    await createItem({ date: new Date(dateISO), title, url })(
      kv,
    );
  }
}

testKV(
  "findItems() returns limited number of items in desc order",
  async (kv) => {
    await setupData(kv);

    let [items, cursor] = await findItems(undefined)(kv);

    assertEquals(items.length, 20);
    assertEquals(items[0].dateISO, "2023-12-11T10:01:00.000Z");
    assertEquals(items[19].dateISO, "2023-03-02T09:00:00.000Z");
    assert(cursor !== "");

    [items, cursor] = await findItems(cursor)(kv);

    assertEquals(items.length, 2);
    assertEquals(items[0].dateISO, "2023-03-01T11:00:00.000Z");
    assertEquals(items[1].dateISO, "2023-03-01T10:00:00.000Z");
    assertEquals(cursor, "");

    await teardown(kv);
  },
);

testKV(
  "searchItems() returns target date of items",
  async (kv) => {
    const data = [
      {
        date: new Date("2023-01-01T10:00:00.000Z"),
        title: "test 1",
        url: "http://example.com",
      },
      {
        date: new Date("2023-01-01T10:10:00.000Z"),
        title: "test 2",
        url: "http://example.com/foo",
      },
      {
        date: new Date("2023-01-02T09:00:00.000Z"),
        title: "test 1",
        url: "http://example.com",
      },
      {
        date: new Date("2023-01-02T10:00:00.000Z"),
        title: "test 2",
        url: "http://example.com/foo",
      },
      {
        date: new Date("2023-01-10T10:00:00.000Z"),
        title: "test 1",
        url: "http://example.com",
      },
      {
        date: new Date("2023-01-10T11:00:00.000Z"),
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
        dateISO: "2023-01-02T09:00:00.000Z",
        title: "test 1",
        url: "http://example.com",
      },
      {
        date: "2023-01-02",
        dateISO: "2023-01-02T10:00:00.000Z",
        title: "test 2",
        url: "http://example.com/foo",
      },
    ]);

    await teardown(kv);
  },
);

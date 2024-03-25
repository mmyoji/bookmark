import { assert, assertEquals } from "@std/assert";

import { kv } from "@/lib/kv/_core.ts";
import { kvHelper } from "@/lib/kv/_test-helpers.ts";
import {
  createItem,
  deleteItem,
  findItem,
  findItems,
  Item,
  searchItems,
  updateItem,
} from "@/lib/kv/items.ts";

Deno.test("createItem() saves data", async () => {
  const date = "2023-05-04";
  const dateISO = `${date}T10:00:00.000Z`;
  await createItem({
    date: new Date(dateISO),
    url: "http://example.com",
    title: "Example Page",
  });

  const res = await kv.get<Item>(["items", date, dateISO]);

  assertEquals(res.value, {
    date,
    dateISO,
    url: "http://example.com",
    title: "Example Page",
  });

  await kvHelper.item.deleteAll();
});

Deno.test("deleteItem() deletes given key", async () => {
  const date = "2023-05-04";
  const dateISO = `${date}T10:00:00.000Z`;
  await kvHelper.item.create({
    date: new Date(dateISO),
    url: "http://example.com",
    title: "Example Page",
  });

  await deleteItem(dateISO);

  const res = await kv.get(["items", date, dateISO]);
  assertEquals(res.value, null);

  await kvHelper.item.deleteAll();
});

Deno.test("findItem() returns an item w/ given key", async () => {
  const date = "2023-05-04";
  const dateISO = `${date}T10:00:00.000Z`;
  await kvHelper.item.create({
    date: new Date(dateISO),
    url: "http://example.com",
    title: "Example Page",
  });

  {
    const item = await findItem(dateISO);

    assert(item);
    assertEquals(item.title, "Example Page");
    assertEquals(item.url, "http://example.com");
  }

  {
    const item = await findItem(`${date}T09:00:00.000Z`);

    assertEquals(item, null);
  }

  await kvHelper.item.deleteAll();
});

const shuffle = <T>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

async function setupData() {
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

  await Promise.all(
    dateISOs.map((dateISO) =>
      kvHelper.item.create({ date: new Date(dateISO), title, url })
    ),
  );
}

Deno.test(
  "findItems() returns limited number of items in desc order",
  async () => {
    await setupData();

    let [items, cursor] = await findItems(undefined);

    assertEquals(items.length, 20);
    assertEquals(items[0].dateISO, "2023-12-11T10:01:00.000Z");
    assertEquals(items[19].dateISO, "2023-03-02T09:00:00.000Z");
    assert(cursor !== "");

    [items, cursor] = await findItems(cursor);

    assertEquals(items.length, 2);
    assertEquals(items[0].dateISO, "2023-03-01T11:00:00.000Z");
    assertEquals(items[1].dateISO, "2023-03-01T10:00:00.000Z");
    assertEquals(cursor, "");

    await kvHelper.item.deleteAll();
  },
);

Deno.test(
  "searchItems() returns target date of items",
  async () => {
    await Promise.all([
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
    ].map((data) => kvHelper.item.create(data)));

    const items = await searchItems("2023-01-02");

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

    await kvHelper.item.deleteAll();
  },
);

Deno.test("updateItem() updates an item", async () => {
  const date = "2023-05-04";
  const dateISO = `${date}T10:00:00.000Z`;
  await kvHelper.item.create({
    date: new Date(dateISO),
    url: "http://example.com",
    title: "Example Page",
  });

  await updateItem({
    date,
    dateISO,
    url: "http://example.com",
    title: "Example Page - 2",
    note: "test note",
  });

  const res = await kv.get<Item>(["items", date, dateISO]);
  assert(res.value);
  assertEquals(res.value.date, date);
  assertEquals(res.value.dateISO, dateISO);
  assertEquals(res.value.title, "Example Page - 2");
  assertEquals(res.value.url, "http://example.com");
  assertEquals(res.value.note, "test note");

  await kvHelper.item.deleteAll();
});

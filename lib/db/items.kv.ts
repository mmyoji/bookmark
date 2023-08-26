import { defineKVFunc, list } from "@/lib/db/kv.ts";

export type Item = {
  date: string; // YYYY-MM-DD
  dateISO: string;
  url: string;
  title: string;
};

const PREFIX = "items";

export const createItem = defineKVFunc<
  Pick<Item, "url" | "title"> & { date: Date },
  void
>(async (kv, data) => {
  const dateISO = data.date.toISOString();
  const date = dateISO.slice(0, 10);
  await kv.set([PREFIX, date, dateISO], { ...data, date, dateISO });
});

export const deleteItem = defineKVFunc<string, void>(
  async (kv, dateISO) => {
    await kv.delete([PREFIX, dateISO.slice(0, 10), dateISO]);
  },
);

export const findItems = defineKVFunc<string | undefined, [Item[], string]>(
  (kv, cursor) =>
    list<Item>([{ prefix: [PREFIX] }, {
      cursor,
      reverse: true,
      limit: 20,
    }])(kv),
);

export const searchItems = defineKVFunc<string, Item[]>(async (kv, date) => {
  const [items] = await list<Item>([{ prefix: [PREFIX, date] }])(kv);
  return items;
});

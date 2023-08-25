import { defineKVFunc, list } from "@/lib/db/kv.ts";

export type Item = {
  date: string; // YYYY-MM-DD
  url: string;
  title: string;
};

const PREFIX = "items";

export const createItem = defineKVFunc<Item, void>(async (kv, data) => {
  await kv.set([PREFIX, data.date, data.url], data);
});

export const deleteItem = defineKVFunc<Pick<Item, "date" | "url">, void>(
  async (kv, data) => {
    await kv.delete([PREFIX, data.date, data.url]);
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

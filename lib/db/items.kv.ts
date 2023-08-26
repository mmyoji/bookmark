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

export const deleteItemLegacy = defineKVFunc<Pick<Item, "date" | "url">, void>(
  async (kv, data) => {
    await kv.delete([PREFIX, data.date, data.url]);
  },
);

export const deleteItem = defineKVFunc<Pick<Item, "date" | "dateISO">, void>(
  async (kv, data) => {
    await kv.delete([PREFIX, data.date, data.dateISO]);
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

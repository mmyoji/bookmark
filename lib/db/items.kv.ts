import { KVFunc, list } from "@/lib/db/kv.ts";

export type Item = {
  date: string; // YYYY-MM-DD
  url: string;
  title: string;
};

const KEY = "items";

export const createItem = (data: Item): KVFunc<void> => {
  return async (kv) => {
    await kv.set([KEY, data.date, data.url], data);
  };
};

export const deleteItem = (data: Pick<Item, "date" | "url">): KVFunc<void> => {
  return async (kv) => {
    await kv.delete([KEY, data.date, data.url]);
  };
};

export const findItems = (
  cursor: string | undefined,
): KVFunc<[Item[], string]> => {
  return (kv) =>
    list<Item>([{ prefix: [KEY] }, {
      cursor,
      reverse: true,
      limit: 20,
    }])(kv);
};

export const searchItems = (date: string): KVFunc<Item[]> => {
  return async (kv) => {
    const [items] = await list<Item>([{ prefix: [KEY, date] }])(kv);
    return items;
  };
};

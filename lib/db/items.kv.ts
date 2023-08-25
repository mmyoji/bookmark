import { KVFunc, list } from "@/lib/db/kv.ts";

export type Item = {
  date: string; // YYYY-MM-DD
  url: string;
  title: string;
};

const PREFIX = "items";

export const createItem = (data: Item): KVFunc<void> => {
  return async (kv) => {
    await kv.set([PREFIX, data.date, data.url], data);
  };
};

export const deleteItem = (data: Pick<Item, "date" | "url">): KVFunc<void> => {
  return async (kv) => {
    await kv.delete([PREFIX, data.date, data.url]);
  };
};

export const findItems = (
  cursor: string | undefined,
): KVFunc<[Item[], string]> => {
  return (kv) =>
    list<Item>([{ prefix: [PREFIX] }, {
      cursor,
      reverse: true,
      limit: 20,
    }])(kv);
};

export const searchItems = (date: string): KVFunc<Item[]> => {
  return async (kv) => {
    const [items] = await list<Item>([{ prefix: [PREFIX, date] }])(kv);
    return items;
  };
};

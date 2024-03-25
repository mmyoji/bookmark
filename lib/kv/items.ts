import { kv, list } from "@/lib/kv/_core.ts";

export type Item = {
  date: string; // YYYY-MM-DD
  dateISO: string;
  url: string;
  title: string;
  note?: string;
};

const PREFIX = "items";

export async function createItem(
  data: Pick<Item, "url" | "title"> & { date: Date },
): Promise<void> {
  const dateISO = data.date.toISOString();
  const date = dateISO.slice(0, 10);
  await kv.set([PREFIX, date, dateISO], { ...data, date, dateISO });
}

export async function deleteItem(dateISO: string): Promise<void> {
  await kv.delete([PREFIX, dateISO.slice(0, 10), dateISO]);
}

export async function findItem(dateISO: string): Promise<Item | null> {
  const res = await kv.get<Item>([PREFIX, dateISO.slice(0, 10), dateISO]);
  return res.value;
}

export function findItems(
  cursor: string | undefined,
): Promise<[Item[], string]> {
  return list<Item>([{ prefix: [PREFIX] }, {
    cursor,
    reverse: true,
    limit: 20,
  }]);
}

export async function searchItems(date: string): Promise<Item[]> {
  const [items] = await list<Item>([{ prefix: [PREFIX, date] }]);
  return items;
}

export async function updateItem(item: Item): Promise<void> {
  await kv.set([PREFIX, item.date, item.dateISO], { ...item });
}

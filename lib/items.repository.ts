import { KV } from "@/lib/kv.ts";

type Item = {
  date: string; // YYYY-MM-DD
  url: string;
  title: string;
};

const KEY = "items";

export class ItemsRepository {
  constructor(private kv: KV) {}

  async create(data: Item): Promise<void> {
    await this.kv.set([KEY, data.date, data.url], data);
  }

  findMany(): Promise<Item[]> {
    return this.#list([{ prefix: [KEY] }, {
      reverse: true,
      limit: 20,
    }]);
  }

  search(date: string): Promise<Item[]> {
    return this.#list([{ prefix: [KEY, date] }]);
  }

  async #list(
    options: Parameters<Deno.Kv["list"]>,
  ): Promise<Item[]> {
    const items: Item[] = [];
    for await (const entry of this.kv.list<Item>(...options)) {
      items.push(entry.value);
    }
    return items;
  }
}

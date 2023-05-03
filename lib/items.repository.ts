type Item = {
  date: string; // YYYY-MM-DD
  url: string;
  title: string;
};

export class ItemsRepository {
  constructor(private kv: Deno.Kv) {}

  async create(data: Item): Promise<void> {
    await this.kv.set(["items", data.date, data.url], data);
  }

  findMany(): Promise<Item[]> {
    return this.#list([{ prefix: ["items"] }, {
      reverse: true,
      limit: 20,
    }]);
  }

  search(date: string): Promise<Item[]> {
    return this.#list([{ prefix: ["items", date] }]);
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

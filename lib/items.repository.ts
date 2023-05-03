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

  async findMany(): Promise<Item[]> {
    const items: Item[] = [];
    for await (
      const entry of this.kv.list<Item>({ prefix: ["items"] }, {
        reverse: true,
        limit: 20,
      })
    ) {
      items.push(entry.value);
    }
    return items;
  }

  async search(date: string): Promise<Item[]> {
    const items: Item[] = [];
    for await (const entry of this.kv.list<Item>({ prefix: ["items", date] })) {
      items.push(entry.value);
    }
    return items;
  }
}

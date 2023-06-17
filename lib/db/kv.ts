export type KV = Deno.Kv;

export type KVFunc<T> = (kv: KV) => Promise<T>;

export const kv = await Deno.openKv(Deno.env.get("KV_PATH"));

export async function runKV<T>(fn: (kv: KV) => Promise<T>): Promise<T> {
  const ret = await fn(kv);
  return ret;
}

export function list<T>(
  options: Parameters<KV["list"]>,
): KVFunc<[T[], string]> {
  return async (kv) => {
    const data: T[] = [];
    const list = kv.list<T>(...options);
    for await (const entry of list) {
      data.push(entry.value);
    }
    return [data, list.cursor];
  };
}

export function testKV(
  desc: string,
  fn: (kv: KV) => Promise<void>,
): void {
  Deno.test(desc, async () => {
    const kv = await Deno.openKv(":memory:");

    await fn(kv);

    kv.close();
  });
}

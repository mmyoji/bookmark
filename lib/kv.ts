export type KV = Deno.Kv;

export type KVFunc<T> = (kv: KV) => Promise<T>;

const initKV = () => Deno.openKv();

export async function run<T>(fn: (kv: KV) => Promise<T>): Promise<T> {
  const kv = await initKV();
  const ret = await fn(kv);
  await kv.close();
  return ret;
}

export function list<T>(options: Parameters<KV["list"]>): KVFunc<T[]> {
  return async (kv) => {
    const data: T[] = [];
    for await (const entry of kv.list<T>(...options)) {
      data.push(entry.value);
    }
    return data;
  };
}

export const initTestKV = () => Deno.openKv(":memory:");

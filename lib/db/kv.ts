export type KV = Deno.Kv;

export type KVFunc<T> = (kv: KV) => Promise<T>;

const kv = await Deno.openKv();

export async function runKV<T>(fn: (kv: KV) => Promise<T>): Promise<T> {
  const ret = await fn(kv);
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

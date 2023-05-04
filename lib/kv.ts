export type KV = Deno.Kv;

const initKV = () => Deno.openKv();

export async function run<T>(fn: (kv: KV) => Promise<T>): Promise<T> {
  const kv = await initKV();
  const ret = await fn(kv);
  await kv.close();
  return ret;
}

export const initTestKV = () => Deno.openKv(":memory:");

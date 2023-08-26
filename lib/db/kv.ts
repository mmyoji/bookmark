export type KV = Deno.Kv;

type KVFunc<T> = (kv: KV) => Promise<T>;

export const kv = await Deno.openKv(Deno.env.get("KV_PATH"));

export function runKV<T>(fn: (kv: KV) => Promise<T>): Promise<T> {
  return fn(kv);
}

export function defineKVFunc<Arg, ReturnValue>(
  fn: (kv: KV, arg: Arg) => Promise<ReturnValue>,
): (arg: Arg) => KVFunc<ReturnValue> {
  return (arg) => (kv) => fn(kv, arg);
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

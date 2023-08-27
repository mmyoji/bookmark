export const kv = await Deno.openKv(Deno.env.get("KV_PATH"));

export async function list<T>(
  options: Parameters<Deno.Kv["list"]>,
): Promise<[T[], string]> {
  const data: T[] = [];
  const list = kv.list<T>(...options);
  for await (const entry of list) {
    data.push(entry.value);
  }
  return [data, list.cursor];
}

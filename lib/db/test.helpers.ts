import { KV } from "@/lib/db/kv.ts";

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

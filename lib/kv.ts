export type KV = Deno.Kv;

export const initKV = () => Deno.openKv();

export const initTestKV = () => Deno.openKv(":memory:");

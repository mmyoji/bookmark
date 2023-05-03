import { assert } from "std/testing/asserts.ts";

import { type Handlers } from "$fresh/server.ts";

import { ItemsRepository } from "@/lib/items.repository.ts";

export const handler: Handlers = {
  async GET(req) {
    const createdAt = new URL(req.url).searchParams.get("created_at");

    assert(typeof createdAt === "string");

    const headers = new Headers();
    headers.set("Content-type", "application/json");

    const kv = await Deno.openKv();
    const repo = new ItemsRepository(kv);
    const items = await repo.search(createdAt);

    await kv.close();

    return new Response(JSON.stringify(items), {
      headers,
    });
  },
};

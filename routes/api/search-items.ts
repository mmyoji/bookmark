import { assert } from "std/testing/asserts.ts";

import { type Handlers } from "$fresh/server.ts";

import { ItemsRepository } from "@/lib/items.repository.ts";
import { initKV } from "@/lib/kv.ts";

export const handler: Handlers = {
  async GET(req) {
    const date = new URL(req.url).searchParams.get("date");

    assert(typeof date === "string");

    const headers = new Headers();
    headers.set("Content-type", "application/json");

    const kv = await initKV();
    const repo = new ItemsRepository(kv);
    const items = await repo.search(date);

    await kv.close();

    return new Response(JSON.stringify(items), {
      headers,
    });
  },
};

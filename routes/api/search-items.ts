import { assert } from "std/testing/asserts.ts";

import { type Handlers } from "$fresh/server.ts";

import { ItemsRepository } from "@/lib/items.repository.ts";
import { run } from "@/lib/kv.ts";

export const handler: Handlers = {
  async GET(req) {
    const date = new URL(req.url).searchParams.get("date");

    assert(typeof date === "string");

    const headers = new Headers();
    headers.set("Content-type", "application/json");

    const items = await run((kv) => {
      const repo = new ItemsRepository(kv);
      return repo.search(date);
    });

    return new Response(JSON.stringify(items), {
      headers,
    });
  },
};

import { assert } from "$std/assert/mod.ts";

import { createItem } from "@/lib/kv/items.ts";
import { parseTitle } from "@/lib/html-parser.ts";

async function fetchTitle(url: string): Promise<string> {
  const res = await fetch(url).catch(() => undefined);
  if (!res || !res.ok) {
    return "";
  }

  const text = await res.text().catch(() => "");
  return parseTitle(text);
}

async function run(url: FormDataEntryValue | null): Promise<void> {
  assert(typeof url === "string");

  const title = await fetchTitle(url);
  await createItem({ date: Temporal.Now.instant(), url, title });
}

export const itemCreationService = {
  run,
};

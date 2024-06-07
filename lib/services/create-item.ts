import { createItem as _createItem } from "@/lib/kv/items.ts";
import { parseTitle } from "@/lib/html-parser.ts";

async function fetchTitle(url: string): Promise<string> {
  const res = await fetch(url).catch(() => undefined);
  if (!res || !res.ok) {
    return "";
  }

  const text = await res.text().catch(() => "");
  return parseTitle(text);
}

export async function createItem(
  url: FormDataEntryValue | null,
): Promise<void> {
  if (typeof url !== "string") {
    throw new TypeError("`url` must be string");
  }

  const title = await fetchTitle(url);
  await _createItem({ date: new Date(), url, title });
}

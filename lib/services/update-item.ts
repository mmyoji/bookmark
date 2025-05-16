import { type Item, updateItem as _updateItem } from "@/lib/kv/items.ts";

type Params = {
  title: FormDataEntryValue | null;
  url: FormDataEntryValue | null;
  note: FormDataEntryValue | null;
};

function validate(
  p: Params,
): p is { title: string; url: string; note: string } {
  return (
    (typeof p.title === "string" && p.title.length > 0) &&
    (typeof p.url === "string" && p.url.length > 0) &&
    (typeof p.note === "string")
  );
}

export async function updateItem(item: Item, p: Params): Promise<void> {
  if (!validate(p)) {
    throw new TypeError("Invalid object is passed");
  }

  await _updateItem({
    ...item,
    ...p,
  });
}

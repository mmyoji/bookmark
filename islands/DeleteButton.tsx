import { type JSX } from "preact";
import IconTrash from "tabler_icons_tsx/tsx/trash.tsx";

import { type Item } from "@/lib/db/items.kv.ts";

type Props = {
  item: Pick<Item, "date" | "url">;
};

export function DeleteButton({ item: { date, url } }: Props) {
  const handleClick: JSX.MouseEventHandler<HTMLButtonElement> = async () => {
    if (!confirm("Are you sure to delete this?")) {
      return;
    }

    const res = await fetch(new URL(`/items/${date}`, location.origin), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!res.ok || res.status >= 400) {
      return alert("Something wrong happens");
    }

    location.reload();
  };

  return (
    <button class="text-slate-600" onClick={handleClick}>
      <IconTrash class="w-5 h-5" />
    </button>
  );
}

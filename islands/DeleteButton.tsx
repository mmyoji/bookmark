import { IconTrash } from "@tabler/icons-preact";
import type { JSX } from "preact";

import type { Item } from "@/lib/kv/items.ts";

type Props = {
  dateISO: Item["dateISO"];
};

export function DeleteButton({ dateISO }: Props) {
  const handleClick: JSX.MouseEventHandler<HTMLButtonElement> = async () => {
    if (!confirm("Are you sure to delete this?")) {
      return;
    }

    const res = await fetch(
      new URL(`/items/${dateISO}`, location.origin),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok || res.status >= 400) {
      return alert("Something wrong happens");
    }

    const li = document.getElementById(dateISO);
    if (li) li.remove();
  };

  return (
    <button type="button" class="text-slate-600" onClick={handleClick}>
      <IconTrash class="w-5 h-5" />
    </button>
  );
}

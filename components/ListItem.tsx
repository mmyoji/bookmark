import { difference } from "$std/datetime/mod.ts";

import { DeleteButton } from "@/islands/DeleteButton.tsx";

import { config } from "@/lib/config.ts";
import { type Item } from "@/lib/db/items.kv.ts";

type Props = {
  item: Item;
  isSignIn: boolean;
};

export function ListItem(
  { item: { url, title, date, dateISO }, isSignIn }: Props,
) {
  const { days } = difference(new Date(), new Date(date), { units: ["days"] });
  const bgColor = (days ?? 0) > config.remindIn + 1 ? "bg-gray-200" : "";

  return (
    <li
      id={dateISO || url}
      class={`border rounded p-2 my-1.5 flex justify-between ${bgColor}`}
    >
      <div>
        <h3>
          <a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            class="underline text-pink-700 break-all"
          >
            {title || url}
          </a>
        </h3>
        <time class="text-gray-500" dateTime={dateISO}>
          {dateISO}
        </time>
      </div>
      {isSignIn && (
        <div>
          <DeleteButton dateISO={dateISO} />
        </div>
      )}
    </li>
  );
}

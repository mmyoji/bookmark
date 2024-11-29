import { difference } from "@std/datetime";
import IconEdit from "tabler_icons_tsx/tsx/edit.tsx";

import { DeleteButton } from "@/islands/DeleteButton.tsx";

import { config } from "@/lib/config.ts";
import { type Item } from "@/lib/kv/items.ts";

type Props = {
  item: Item;
  isSignIn: boolean;
};

const getBgColor = (days: number) => {
  if (days > config.remindIn + 7) {
    return "bg-gray-200";
  }

  return (days > config.remindIn) ? "bg-pink-100" : "";
};

export function ListItem(
  { item: { url, title, date, dateISO, note }, isSignIn }: Props,
) {
  const bgColor = getBgColor(
    difference(new Date(), new Date(date), { units: ["days"] }).days ?? 0,
  );

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
        <div class="flex">
          <time class="text-gray-500" dateTime={dateISO}>
            {dateISO}
          </time>
          {isSignIn && (
            <span class="ml-2 leading-loose text-pink-700">
              <a href={`/items/${dateISO}/edit`}>
                <IconEdit />
              </a>
            </span>
          )}
        </div>
        {note
          ? (
            <>
              <hr class="mt-2" />
              <p class="whitespace-pre-line">{note}</p>
            </>
          )
          : <></>}
      </div>
      {isSignIn && (
        <div>
          <DeleteButton dateISO={dateISO} />
        </div>
      )}
    </li>
  );
}

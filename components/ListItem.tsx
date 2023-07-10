import DeleteButton from "@/islands/DeleteButton.tsx";

import { config } from "@/lib/config.ts";
import { countDaysBetween } from "@/lib/date.utils.ts";
import { type Item } from "@/lib/db/items.kv.ts";

type Props = {
  item: Item;
  isSignIn: boolean;
};

export function ListItem({ item: { url, title, date }, isSignIn }: Props) {
  const days = countDaysBetween(new Date(), new Date(date));
  const bgColor = days > config.remindIn + 1 ? "bg-gray-200" : "";

  return (
    <li class={`border rounded p-2 my-1.5 flex justify-between ${bgColor}`}>
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
        <time class="text-gray-500" dateTime={date}>
          {date}
        </time>
      </div>
      {isSignIn && (
        <div>
          <DeleteButton item={{ date, url }} />
        </div>
      )}
    </li>
  );
}

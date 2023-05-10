import { countDaysBetween } from "@/lib/date.utils.ts";

type Props = {
  url: string;
  title: string;
  date: string;
};

export function URLListItem({ url, title, date }: Props) {
  const days = countDaysBetween(new Date(), new Date(date));
  const bgColor = days > 7 ? "bg-gray-200" : "";

  return (
    <li class={`border rounded p-2 my-1.5 ${bgColor}`}>
      <h3>
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          class="underline text-pink-700"
        >
          {title || url}
        </a>
      </h3>
      <time class="text-gray-500" dateTime={date}>
        {date}
      </time>
    </li>
  );
}

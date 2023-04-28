import { getDaysDiff } from "@/lib/get-days-diff.ts";

type Props = {
  url: string;
  title: string;
  createdAt: string;
};

export function URLListItem({ url, title, createdAt }: Props) {
  const diffDays = getDaysDiff(new Date(), new Date(createdAt));
  const bgColor = diffDays > 7 ? "bg-gray-200" : "";

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
      <time class="text-gray-500" dateTime={createdAt}>
        {createdAt}
      </time>
    </li>
  );
}

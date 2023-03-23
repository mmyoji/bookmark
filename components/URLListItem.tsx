type Props = {
  url: string;
  createdAt: string;
};

function getDiffDays(createdAt: string): number {
  const date = new Date(createdAt);
  const now = new Date();
  const diff = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function URLListItem({ url, createdAt }: Props) {
  const diffDays = getDiffDays(createdAt);
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
          {url}
        </a>
      </h3>
      <time class="text-gray-500" dateTime={createdAt}>{createdAt}</time>
    </li>
  );
}

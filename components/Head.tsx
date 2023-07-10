import { Head as FreshHead } from "$fresh/runtime.ts";

import { config } from "@/lib/config.ts";

type Props = {
  title?: string;
};

const appName = config.name;

export function Head({ title }: Props) {
  const titleText = [title, appName].filter(Boolean).join(" - ");

  return (
    <FreshHead>
      <title>{titleText}</title>
      <meta name="robots" content="noindex, nofollow" />
    </FreshHead>
  );
}

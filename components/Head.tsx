import { Head as FreshHead } from "$fresh/runtime.ts";

import { appConfig } from "@/lib/app.config.ts";

type Props = {
  title?: string;
};

const appName = appConfig.name;

export function Head({ title }: Props) {
  const titleText = [title, appName].filter(Boolean).join(" - ");

  return (
    <FreshHead>
      <title>{titleText}</title>
      <meta name="robots" content="noindex, nofollow" />
    </FreshHead>
  );
}

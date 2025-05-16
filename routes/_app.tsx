import type { FreshContext } from "fresh";

import { State } from "../utils.ts";

import { config } from "@/lib/config.ts";

export default function App(ctx: FreshContext<State>) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
        <title>
          {[ctx.state.title, config.name].filter(Boolean).join(" - ")}
        </title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        {/* @ts-expect-error ignore currently */}
        <ctx.Component />
      </body>
    </html>
  );
}

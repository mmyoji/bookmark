import { config } from "@/lib/config.ts";
import { define } from "@/utils.ts";

export default define.page((ctx) => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
        <title>
          {[ctx.state.title, config.name].filter(Boolean).join(" - ")}
        </title>
      </head>
      <body>
        <ctx.Component />
      </body>
    </html>
  );
});

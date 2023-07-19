/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import twindPlugin from "$fresh/plugins/twindv1.ts";
import twindConfig from "./twind.config.ts";

// @ts-expect-error Async Router Components with State type is not supported yet
await start(manifest, {
  port: Number(Deno.env.get("PORT") || "8000"),
  plugins: [twindPlugin(twindConfig)],
});

import { defineConfig } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";

import type { Options } from "$fresh/plugins/twindv1.ts";

export default {
  ...defineConfig({
    presets: [presetTailwind()],
  }),
  selfURL: import.meta.url,
} as unknown as Options;

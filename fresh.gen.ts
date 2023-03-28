// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/api/items.ts";
import * as $1 from "./routes/api/login.ts";
import * as $2 from "./routes/api/logout.ts";
import * as $3 from "./routes/api/search-items.ts";
import * as $4 from "./routes/index.tsx";
import * as $5 from "./routes/login.tsx";

const manifest = {
  routes: {
    "./routes/api/items.ts": $0,
    "./routes/api/login.ts": $1,
    "./routes/api/logout.ts": $2,
    "./routes/api/search-items.ts": $3,
    "./routes/index.tsx": $4,
    "./routes/login.tsx": $5,
  },
  islands: {},
  baseUrl: import.meta.url,
  config,
};

export default manifest;
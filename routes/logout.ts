import { type Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";

import { config } from "@/lib/config.ts";

export const handler: Handlers = {
  GET() {
    const headers = new Headers({ location: "/" });
    deleteCookie(headers, config.cookies.key.uid, { path: "/" });
    return new Response(null, { headers, status: 302 });
  },
};

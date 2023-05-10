import { type Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";

import { CookieKey } from "@/lib/cookie-keys.ts";

export const handler: Handlers = {
  GET() {
    const headers = new Headers({ location: "/" });
    deleteCookie(headers, CookieKey.uid, { path: "/" });
    return new Response(null, { headers, status: 302 });
  },
};

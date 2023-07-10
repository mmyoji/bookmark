import { type Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";

import { appConfig } from "@/lib/app.config.ts";

export const handler: Handlers = {
  GET() {
    const headers = new Headers({ location: "/" });
    deleteCookie(headers, appConfig.cookies.key.uid, { path: "/" });
    return new Response(null, { headers, status: 302 });
  },
};

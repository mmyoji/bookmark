import { type Handlers } from "$fresh/server.ts";
import { deleteCookie } from "$std/http/cookie.ts";

import { config } from "@/lib/config.ts";
import { redirect } from "@/lib/response.utils.ts";

export const handler: Handlers = {
  GET() {
    const headers = new Headers({ location: "/" });
    deleteCookie(headers, config.cookies.key.uid, { path: "/" });
    return redirect(headers);
  },
};

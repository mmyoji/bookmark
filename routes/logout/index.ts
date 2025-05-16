import { deleteCookie } from "@std/http";

import { config } from "@/lib/config.ts";
import { redirect } from "@/lib/response.utils.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  GET() {
    const headers = new Headers({ location: "/" });
    deleteCookie(headers, config.cookies.key.uid, { path: "/" });
    return redirect(headers);
  },
});

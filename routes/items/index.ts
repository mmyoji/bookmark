import { type Handlers } from "$fresh/server.ts";
import { type State } from "@/lib/context.ts";
import { redirect } from "@/lib/response.utils.ts";
import { createItem } from "@/lib/services/create-item.ts";

export const handler: Handlers<unknown, State> = {
  async POST(req, ctx) {
    if (!ctx.state.currentUser) {
      return redirect({ location: "/login" });
    }

    const form = await req.formData();
    await createItem(form.get("url"));

    return redirect({ location: "/" });
  },
};

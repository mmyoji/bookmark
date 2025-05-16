import { redirect } from "@/lib/response.utils.ts";
import { createItem } from "@/lib/services/create-item.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  async POST(ctx) {
    const req = ctx.req;

    if (!ctx.state.currentUser) {
      return redirect({ location: "/login" });
    }

    const form = await req.formData();
    await createItem(form.get("url"));

    return redirect({ location: "/" });
  },
});

import { type Handlers } from "$fresh/server.ts";

import { createSupabaseClient } from "@/lib/supabase.ts";

export const handler: Handlers = {
  async GET(req) {
    const headers = new Headers({ location: "/" });
    const supabase = createSupabaseClient(req.headers, headers);

    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    return new Response(null, { headers, status: 302 });
  },
};

import { type Handlers } from "$fresh/server.ts";

import { config } from "@/lib/config.ts";
import { userRegistrationService } from "@/lib/services/user-registration.ts";

function validAuth(auth: string | null): boolean {
  if (!auth) return false;

  const [_, apiKey] = auth.split("Bearer ");
  return !!apiKey && apiKey === config.api.key;
}

export const handler: Handlers = {
  async POST(req) {
    if (!validAuth(req.headers.get("Authorization"))) {
      return new Response(null, { status: 404 });
    }

    const params = await req.json();

    const { error } = await userRegistrationService.run({
      username: params.username,
      password: params.password,
    });

    if (error != null) {
      return new Response(JSON.stringify({ error }), {
        status: 422,
      });
    }

    return new Response(JSON.stringify({ message: "Created" }), {
      status: 201,
    });
  },
};

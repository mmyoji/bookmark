#!/usr/bin/env -S deno run --unstable-kv --allow-env

import { createAccount } from "@/lib/services/create-account.ts";

await createAccount({
  username: Deno.env.get("LOGIN_USERNAME"),
  password: Deno.env.get("LOGIN_PASSWORD"),
});

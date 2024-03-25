#!/usr/bin/env -S deno run --unstable-kv --allow-env

import { assert } from "@std/assert";

import { userRegistrationService } from "@/lib/services/user-registration.ts";

const username = Deno.env.get("LOGIN_USERNAME");
const password = Deno.env.get("LOGIN_PASSWORD");

assert(username);
assert(password);

await userRegistrationService.run({
  username,
  password,
});

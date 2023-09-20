import { assert } from "$std/assert/mod.ts";

import { createLogin } from "@/lib/kv/logins.ts";
import { hashPassword } from "@/lib/password.ts";

const error = "username and/or password is invalid";

async function run(
  { username, password }: { username: unknown; password: unknown },
): Promise<{ error: string | null }> {
  try {
    assert(typeof username === "string" && !!username.trim());
    assert(typeof password === "string" && !!password.trim());
  } catch (_err) {
    return { error };
  }

  await createLogin({
    username,
    hashedPassword: hashPassword(password),
  });

  return { error: null };
}

export const userRegistrationService = { run };

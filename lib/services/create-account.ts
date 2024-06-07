import { createLogin } from "@/lib/kv/logins.ts";
import { hashPassword } from "@/lib/password.ts";

type Params = {
  username: string | undefined;
  password: string | undefined;
};

function validate(p: Params): p is { username: string; password: string } {
  return (
    (typeof p.username === "string" && !!p.username.trim()) && (
      typeof p.password === "string" && !!p.password.trim()
    )
  );
}

export async function createAccount(p: Params): Promise<{ error: string }> {
  if (!validate(p)) {
    return { error: "username and/or password is invalid" };
  }

  await createLogin({
    username: p.username,
    hashedPassword: hashPassword(p.password),
  });

  return { error: "" };
}

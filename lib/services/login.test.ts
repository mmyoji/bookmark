import { loginService } from "@/lib/services/login.ts";

import { assertEquals } from "$std/assert/mod.ts";

import { kvHelper } from "@/lib/kv/_test-helpers.ts";

Deno.test("loginService.run() returns error when username (or password) is not present", async () => {
  const { username, error } = await loginService.run({
    username: null,
    password: "password",
  });

  assertEquals(username, null);
  assertEquals(error, "You are not allowed to login");
});

Deno.test("loginService.run() returns error with invalid username", async () => {
  const { username, error } = await loginService.run({
    username: "test-user",
    password: "password",
  });

  assertEquals(username, null);
  assertEquals(error, "You are not allowed to login");
});

Deno.test("loginService.run() returns error with invalid password", async () => {
  await kvHelper.login.create({ username: "test-user", password: "P@s$w0rd" });

  const { username, error } = await loginService.run({
    username: "test-user",
    password: "password",
  });

  assertEquals(username, null);
  assertEquals(error, "You are not allowed to login");
});

Deno.test("loginService.run() returns username with valid credentials", async () => {
  await kvHelper.login.create({ username: "test-user", password: "P@s$w0rd" });

  const { username, error } = await loginService.run({
    username: "test-user",
    password: "P@s$w0rd",
  });

  assertEquals(username, "test-user");
  assertEquals(error, null);
});

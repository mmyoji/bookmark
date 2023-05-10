import { crypto, timingSafeEqual, toHashString } from "$std/crypto/mod.ts";
import { decode } from "$std/encoding/hex.ts";

function toHash(password: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest(
    "BLAKE3",
    new TextEncoder().encode(password),
  );
}

export async function hashPassword(password: string): Promise<string> {
  const buf = await toHash(password);
  return toHashString(buf);
}

export async function verifyPassword(
  password: string,
  encryptedPassword: string,
): Promise<boolean> {
  const buf1 = await toHash(password);

  const hex = new TextEncoder().encode(encryptedPassword);
  const buf2 = decode(hex);

  return timingSafeEqual(buf1, buf2);
}

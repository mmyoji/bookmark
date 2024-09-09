import { hash, verify } from "@denorg/scrypt";

export function hashPassword(password: string): string {
  return hash(password);
}

export function verifyPassword(
  password: string,
  hashedPassword: string,
): boolean {
  return verify(password, hashedPassword);
}

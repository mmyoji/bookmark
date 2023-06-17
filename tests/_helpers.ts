import { createHandler } from "$fresh/server.ts";
import { type ConnInfo } from "$std/http/server.ts";

import manifest from "@/fresh.gen.ts";

const hostname = "127.0.0.1";

export const origin = `http://${hostname}`;

const CONN_INFO: ConnInfo = {
  localAddr: { hostname, port: 8000, transport: "tcp" },
  remoteAddr: { hostname, port: 53496, transport: "tcp" },
};

export async function visit(req: Request) {
  const handler = await createHandler(manifest);
  return handler(req, CONN_INFO);
}

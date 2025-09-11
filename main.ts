import { App, staticFiles } from "fresh";

import { setCurrentUser } from "@/lib/middlewares/set-current-user.ts";
import type { State } from "@/utils.ts";

export const app = new App<State>();

app.use(staticFiles());
app.use(setCurrentUser);

app.fsRoutes();

if (import.meta.main) {
  await app.listen();
}

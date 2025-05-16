import { App, fsRoutes, staticFiles } from "fresh";

import { setCurrentUser } from "@/lib/middlewares/set-current-user.ts";
import type { State } from "@/utils.ts";

export const app = new App<State>();

app.use(staticFiles());
app.use(setCurrentUser);

// // this is the same as the /api/:name route defined via a file. feel free to delete this!
// app.get("/api2/:name", (ctx) => {
//   const name = ctx.params.name;
//   return new Response(
//     `Hello, ${name.charAt(0).toUpperCase() + name.slice(1)}!`,
//   );
// });

await fsRoutes(app, {
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}

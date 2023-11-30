export const config = {
  name: "Bookmark",
  remindIn: 14, // days
  cookies: {
    key: {
      uid: "_uid",
    },
  },
  deploy: {
    // see https://deno.com/deploy/docs/environment-variables#preset-variables
    id: Deno.env.get("DENO_DEPLOYMENT_ID") || "",
    gitHubToken: Deno.env.get("GITHUB_TOKEN") || "",
  },
} as const;

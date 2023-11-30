import { Octokit } from "octokit";

import { config } from "@/lib/config.ts";

const options = {
  owner: "mmyoji",
  repo: "bookmark",
  headers: {
    "X-GitHub-Api-Version": "2022-11-28",
  },
};

const client = new Octokit({
  auth: config.deploy.gitHubToken,
});

export async function fetchGitHubIssues(): Promise<{ title: string }[]> {
  const { data } = await client.request(
    "GET /repos/{owner}/{repo}/issues?per_page={per}",
    {
      ...options,
      per: 5,
    },
  );

  // `data` actually has more props
  return data as { title: string }[];
}

export async function createGitHubIssue(
  { title, body }: { title: string; body: string },
): Promise<void> {
  await client.request("POST /repos/{owner}/{repo}/issues", {
    ...options,
    title,
    body,
  });
}

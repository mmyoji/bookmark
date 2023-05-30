module.exports = async ({ github, context, fetch, dayjs }) => {
  const date = dayjs().subtract(14, "day").format("YYYY-MM-DD");

  const res = await fetch(
    `https://mmyoji-archive-reminder.deno.dev/api/search-items?date=${date}`,
  );
  const data = await res.json();
  if (!data || !data.length) return;

  const body = data.map(({ url }) => `- ${url}`).join("\n");

  await github.rest.issues.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title: date,
    body,
  });
};

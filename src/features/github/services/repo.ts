import { Octokit } from "@octokit/rest";

const REPO_NAME = process.env.GITHUB_REPO_NAME || "subscription-log";

export async function getOrCreateRepo(octokit: Octokit, owner: string) {
  try {
    const { data } = await octokit.repos.get({ owner, repo: REPO_NAME });
    return data;
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 404
    ) {
      const { data } = await octokit.repos.createForAuthenticatedUser({
        name: REPO_NAME,
        private: true,
        auto_init: true,
        description: "Subscription log - managed by SubLog",
      });
      return data;
    }
    throw error;
  }
}

export { REPO_NAME };

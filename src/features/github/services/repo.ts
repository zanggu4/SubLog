import { Octokit } from "@octokit/rest";

const REPO_NAME = "subscription-ledger";

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
        description: "Subscription ledger - managed by subscription-ledger app",
      });
      return data;
    }
    throw error;
  }
}

export { REPO_NAME };

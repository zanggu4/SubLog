import { Octokit } from "@octokit/rest";
import { REPO_NAME } from "./repo";

const FILE_PATH = "subscriptions.json";

export interface CommitEntry {
  sha: string;
  message: string;
  date: string;
  url: string;
}

export async function getCommitHistory(
  octokit: Octokit,
  owner: string,
  page = 1,
  perPage = 20
): Promise<CommitEntry[]> {
  try {
    const { data } = await octokit.repos.listCommits({
      owner,
      repo: REPO_NAME,
      path: FILE_PATH,
      page,
      per_page: perPage,
    });

    return data.map((commit) => ({
      sha: commit.sha,
      message: commit.commit.message,
      date: commit.commit.author?.date ?? "",
      url: commit.html_url,
    }));
  } catch {
    return [];
  }
}

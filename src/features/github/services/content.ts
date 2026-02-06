import { Octokit } from "@octokit/rest";
import { REPO_NAME } from "./repo";
import { SubscriptionSchema, type Subscription } from "@/features/subscriptions/types";
import { generateId } from "@/features/subscriptions/services/id";
import { z } from "zod";

const FILE_PATH = "subscriptions.json";

export interface SubscriptionsData {
  subscriptions: Subscription[];
  sha: string | null;
}

export async function readSubscriptions(
  octokit: Octokit,
  owner: string
): Promise<SubscriptionsData> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo: REPO_NAME,
      path: FILE_PATH,
    });

    if (Array.isArray(data) || data.type !== "file") {
      return { subscriptions: [], sha: null };
    }

    const content = Buffer.from(data.content, "base64").toString("utf-8");
    const raw = JSON.parse(content);
    const parsed = z.array(SubscriptionSchema.partial({ id: true })).safeParse(raw);
    const subscriptions: Subscription[] = parsed.success
      ? parsed.data.map((sub) => ({ ...sub, id: sub.id || generateId() }) as Subscription)
      : [];

    return { subscriptions, sha: data.sha };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 404
    ) {
      return { subscriptions: [], sha: null };
    }
    throw error;
  }
}

export async function writeSubscriptions(
  octokit: Octokit,
  owner: string,
  subscriptions: Subscription[],
  message: string,
  sha: string | null
): Promise<void> {
  const content = Buffer.from(
    JSON.stringify(subscriptions, null, 2),
    "utf-8"
  ).toString("base64");

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo: REPO_NAME,
    path: FILE_PATH,
    message,
    content,
    ...(sha ? { sha } : {}),
  });
}

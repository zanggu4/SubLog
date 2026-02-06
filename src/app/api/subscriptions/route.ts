import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createOctokit } from "@/lib/octokit";
import { getOrCreateRepo } from "@/features/github/services/repo";
import {
  readSubscriptions,
  writeSubscriptions,
} from "@/features/github/services/content";
import { CreateSubscriptionSchema } from "@/features/subscriptions/types";
import { generateId } from "@/features/subscriptions/services/id";
import { addMessage } from "@/features/subscriptions/services/commit-message";

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const octokit = createOctokit(session.accessToken);
  await getOrCreateRepo(octokit, session.user.login);

  const { subscriptions } = await readSubscriptions(
    octokit,
    session.user.login
  );
  return NextResponse.json(subscriptions);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = CreateSubscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const octokit = createOctokit(session.accessToken);
  await getOrCreateRepo(octokit, session.user.login);

  const { subscriptions, sha } = await readSubscriptions(
    octokit,
    session.user.login
  );

  const id = generateId();

  const newSubscription = {
    id,
    ...parsed.data,
    status: "active" as const,
  };

  subscriptions.push(newSubscription);

  try {
    await writeSubscriptions(
      octokit,
      session.user.login,
      subscriptions,
      addMessage(parsed.data.name),
      sha
    );
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      error.status === 409
    ) {
      return NextResponse.json(
        { error: "Conflict: data was modified. Please refresh and try again." },
        { status: 409 }
      );
    }
    throw error;
  }

  return NextResponse.json(newSubscription, { status: 201 });
}

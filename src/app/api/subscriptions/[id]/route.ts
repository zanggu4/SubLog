import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createOctokit } from "@/lib/octokit";
import { getOrCreateRepo } from "@/features/github/services/repo";
import {
  readSubscriptions,
  writeSubscriptions,
} from "@/features/github/services/content";
import { UpdateSubscriptionSchema } from "@/features/subscriptions/types";
import {
  updateMessage,
  cancelMessage,
} from "@/features/subscriptions/services/commit-message";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = UpdateSubscriptionSchema.safeParse(body);
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

  const index = subscriptions.findIndex((s) => s.id === id);
  if (index === -1) {
    return NextResponse.json(
      { error: "Subscription not found" },
      { status: 404 }
    );
  }

  subscriptions[index] = { ...subscriptions[index], ...parsed.data };

  try {
    await writeSubscriptions(
      octokit,
      session.user.login,
      subscriptions,
      updateMessage(subscriptions[index].name),
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

  return NextResponse.json(subscriptions[index]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const octokit = createOctokit(session.accessToken);
  await getOrCreateRepo(octokit, session.user.login);

  const { subscriptions, sha } = await readSubscriptions(
    octokit,
    session.user.login
  );

  const index = subscriptions.findIndex((s) => s.id === id);
  if (index === -1) {
    return NextResponse.json(
      { error: "Subscription not found" },
      { status: 404 }
    );
  }

  const name = subscriptions[index].name;
  subscriptions[index].status = "cancelled";

  try {
    await writeSubscriptions(
      octokit,
      session.user.login,
      subscriptions,
      cancelMessage(name),
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

  return NextResponse.json({ message: `${name} cancelled` });
}

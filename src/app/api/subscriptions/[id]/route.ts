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
  pauseMessage,
  resumeMessage,
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

  const oldStatus = subscriptions[index].status;
  const newStatus = parsed.data.status;

  // Validate status transitions
  if (newStatus) {
    const validTransitions: Record<string, string[]> = {
      active: ["paused"],
      paused: ["active"],
    };
    if (!validTransitions[oldStatus]?.includes(newStatus)) {
      return NextResponse.json(
        { error: `Cannot transition from ${oldStatus} to ${newStatus}` },
        { status: 400 }
      );
    }
  }

  // Build update data, converting null pausedUntil to undefined (deletion)
  const { pausedUntil: rawPausedUntil, ...restData } = parsed.data;
  const updateData: Record<string, unknown> = { ...restData };
  if (rawPausedUntil !== undefined) {
    updateData.pausedUntil = rawPausedUntil ?? undefined;
  }

  subscriptions[index] = { ...subscriptions[index], ...updateData } as typeof subscriptions[number];

  // Clear pausedUntil when resuming
  if (oldStatus === "paused" && newStatus === "active") {
    delete (subscriptions[index] as Record<string, unknown>).pausedUntil;
  }

  // Determine commit message based on status transition
  let commitMsg: string;
  if (oldStatus === "active" && newStatus === "paused") {
    commitMsg = pauseMessage(subscriptions[index].name);
  } else if (oldStatus === "paused" && newStatus === "active") {
    commitMsg = resumeMessage(subscriptions[index].name);
  } else {
    commitMsg = updateMessage(subscriptions[index].name);
  }

  try {
    await writeSubscriptions(
      octokit,
      session.user.login,
      subscriptions,
      commitMsg,
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

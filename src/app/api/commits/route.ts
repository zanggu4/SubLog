import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createOctokit } from "@/lib/octokit";
import { getCommitHistory } from "@/features/github/services/commits";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = Math.max(1, Math.floor(Number(request.nextUrl.searchParams.get("page")) || 1));
  const octokit = createOctokit(session.accessToken);

  const commits = await getCommitHistory(
    octokit,
    session.user.login,
    page
  );

  return NextResponse.json(commits);
}

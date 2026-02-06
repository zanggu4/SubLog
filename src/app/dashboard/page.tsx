import { auth } from "@/lib/auth";
import { createOctokit } from "@/lib/octokit";
import { getOrCreateRepo } from "@/features/github/services/repo";
import { readSubscriptions } from "@/features/github/services/content";
import { DashboardSummary } from "@/features/subscriptions/components/dashboard-summary";
import { DashboardContent } from "@/features/subscriptions/components/dashboard-content";
import { CommitHistory } from "@/features/subscriptions/components/commit-history";
import { CategoryBreakdown } from "@/features/subscriptions/components/category-breakdown";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.accessToken) return null;

  const octokit = createOctokit(session.accessToken);
  await getOrCreateRepo(octokit, session.user.login);

  const { subscriptions } = await readSubscriptions(
    octokit,
    session.user.login
  );

  return (
    <div className="space-y-8">
      <DashboardSummary subscriptions={subscriptions} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DashboardContent subscriptions={subscriptions} />
        </div>

        <div className="lg:col-span-1 space-y-6">
          <CategoryBreakdown subscriptions={subscriptions} />
          <CommitHistory />
        </div>
      </div>
    </div>
  );
}

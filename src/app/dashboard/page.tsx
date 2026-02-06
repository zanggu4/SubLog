import { auth } from "@/lib/auth";
import { createOctokit } from "@/lib/octokit";
import { getOrCreateRepo } from "@/features/github/services/repo";
import { readSubscriptions } from "@/features/github/services/content";
import { DashboardSummary } from "@/features/subscriptions/components/dashboard-summary";
import { SubscriptionList } from "@/features/subscriptions/components/subscription-list";
import { SubscriptionForm } from "@/features/subscriptions/components/subscription-form";
import { CommitHistory } from "@/features/subscriptions/components/commit-history";

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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">대시보드</h2>
        <SubscriptionForm />
      </div>

      <DashboardSummary subscriptions={subscriptions} />
      <SubscriptionList subscriptions={subscriptions} />
      <CommitHistory />
    </div>
  );
}

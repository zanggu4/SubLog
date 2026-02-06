import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Header } from "@/features/auth/components/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

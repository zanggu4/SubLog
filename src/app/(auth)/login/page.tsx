import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-6">로그인</h1>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="bg-foreground text-background px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            GitHub로 로그인
          </button>
        </form>
      </div>
    </main>
  );
}

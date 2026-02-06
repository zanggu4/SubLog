import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">Subscription Ledger</h1>
        <p className="text-lg text-muted mb-2">
          구독 서비스를 GitHub 커밋으로 관리하세요.
        </p>
        <p className="text-muted mb-8">
          구독 추가 = commit, 가격 변경 = diff, 해지 = commit log
        </p>
        <Link
          href="/login"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors"
        >
          GitHub로 시작하기
        </Link>
      </div>
    </main>
  );
}

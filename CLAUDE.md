# SubLog

GitHub 커밋 기반 구독 가계부 웹앱. DB 없이 GitHub 레포가 저장소 역할.

## 기술 스택

- Next.js 15 (App Router, standalone output)
- TypeScript, Tailwind CSS v4
- Auth.js v5 (next-auth@beta) + GitHub OAuth
- @octokit/rest (GitHub API)
- Zod (유효성 검사)
- pnpm (패키지 매니저)
- Docker (멀티스테이지 빌드)

## 핵심 구조

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # 랜딩 페이지 (Client Component)
│   ├── dashboard/page.tsx  # 대시보드 (Server Component)
│   ├── login/page.tsx      # 로그인
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── subscriptions/route.ts      # GET, POST
│       ├── subscriptions/[id]/route.ts # PUT, DELETE
│       ├── commits/route.ts            # 커밋 히스토리
│       └── exchange-rates/route.ts     # 환율 API
├── lib/
│   ├── auth.ts             # Auth.js 설정 (scope: repo read:user user:email)
│   ├── octokit.ts          # Octokit 팩토리
│   ├── i18n.ts             # 다국어 (en, ko, ja, zh)
│   ├── currency.ts         # 통화 설정 (KRW, USD, JPY, EUR)
│   └── settings-context.tsx # 테마, 언어, 통화 Context
├── features/
│   ├── github/services/    # repo.ts, content.ts, commits.ts
│   ├── subscriptions/
│   │   ├── types/          # Zod 스키마
│   │   ├── services/       # ID 생성, 커밋 메시지 빌더
│   │   └── components/     # form, card, list, summary, history
│   └── auth/components/    # header.tsx
└── components/ui/          # button, card, dialog
```

## 핵심 패턴

- 구독 데이터 → GitHub 레포의 `subscriptions.json`에 저장
- 모든 변경 = GitHub 커밋 (feat: add, chore: update, chore: cancel)
- SHA 기반 낙관적 동시성 제어 (409 Conflict 처리)
- 개별 구독마다 통화 설정 + 글로벌 표시 통화로 환율 변환
- Next.js 15: dynamic route params는 Promise (`await params`)

## 환경변수

- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` — GitHub OAuth App
- `AUTH_SECRET` — Auth.js 암호화 키 (`pnpm dlx auth secret`)
- `GITHUB_REPO_NAME` — 데이터 저장 레포명 (기본값: `subscription-log`)
- `AUTH_URL` — 프로덕션 base URL (리버스 프록시 필수)
- `AUTH_TRUST_HOST` — 프록시 뒤에서 true

## 배포

- GitHub: https://github.com/zanggu4/SubLog
- 실서버: https://sublog.bbiero.dev
- Docker: `docker compose up -d --build`
- 로컬: `pnpm dev`

## 커밋 컨벤션

```
feat: 기능 추가
chore: 설정/유지보수
docs: 문서

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

## 주의사항

- `.env.local` = 로컬 개발용, `.env` = Docker/프로덕션용
- Dockerfile 빌드 시 더미 env 사용 (build-placeholder), 런타임에 실제 값 주입
- 정적 페이지에서 process.env 참조 시 빌드 타임에 인라인됨 → dynamic 페이지는 `force-dynamic` 필요
- 유저 응대는 한국어로
- **작업 완료 후 반드시 이 CLAUDE.md를 최신 상태로 업데이트할 것** (파일/구조 변경, 새 패턴, 환경변수 추가 등)

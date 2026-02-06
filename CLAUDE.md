# SubLog

GitHub 커밋 기반 구독 가계부 웹앱. DB 없이 GitHub 레포가 저장소 역할.

## 기술 스택

- Next.js 16 (App Router, standalone output)
- TypeScript, Tailwind CSS v4
- Auth.js v5 (next-auth@beta) + GitHub OAuth
- @octokit/rest (GitHub API)
- Zod (유효성 검사)
- pnpm (패키지 매니저)
- Docker (멀티스테이지 빌드)
- Google AdSense (ca-pub-3548718549123736)
- 폰트: SUIT Variable (한국어/영어) + Noto Sans JP (일본어) + Noto Sans SC (중국어) + Geist Mono (코드 요소만)

## 핵심 구조

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/             # 다국어 라우팅 (en, ko, ja, zh)
│   │   ├── layout.tsx      # generateMetadata (hreflang, OG, 언어별 title)
│   │   ├── page.tsx        # 랜딩 페이지 (Client Component, JSON-LD)
│   │   └── (auth)/login/
│   │       └── page.tsx    # 로그인 (Server Component, 로컬라이즈)
│   ├── page.tsx            # / → /ko 리다이렉트 (fallback)
│   ├── layout.tsx          # 루트 레이아웃 (폰트, providers, base metadata, AdSense)
│   ├── icon.svg            # SubLog 파비콘 (터미널 프롬프트 아이콘)
│   ├── sitemap.ts          # 사이트맵 (4언어 × 2페이지 = 8 URL + alternates)
│   ├── robots.ts           # robots.txt (/dashboard, /api/ 차단)
│   ├── dashboard/
│   │   ├── layout.tsx      # 대시보드 레이아웃 (robots noindex, 쿠키 기반 로그인 리다이렉트)
│   │   └── page.tsx        # 대시보드 (Server Component)
│   ├── (auth)/login/page.tsx # /login → /ko/login 리다이렉트 (fallback)
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── subscriptions/route.ts      # GET, POST
│       ├── subscriptions/[id]/route.ts # PUT (상태전환 포함), DELETE
│       ├── commits/route.ts            # 커밋 히스토리
│       └── exchange-rates/route.ts     # 환율 API
├── middleware.ts            # 언어 감지 + 리다이렉트 + 인증 보호 (통합)
├── lib/
│   ├── auth.ts             # Auth.js 설정 (scope: repo read:user user:email, AUTH_SECRET 런타임 검증)
│   ├── octokit.ts          # Octokit 팩토리
│   ├── i18n.ts             # 다국어 (en, ko, ja, zh) - SUPPORTED_LANGS, isLanguage(), seo, calendar, categories
│   ├── currency.ts         # 통화 설정 (KRW, USD, JPY, EUR, CNY)
│   └── settings-context.tsx # 테마, 언어, 통화 Context + 쿠키/html lang 동기화
├── features/
│   ├── github/services/    # repo.ts, content.ts (Zod safeParse 검증), commits.ts
│   ├── subscriptions/
│   │   ├── types/          # Zod 스키마 (CATEGORIES, CATEGORY_CONFIG 포함)
│   │   ├── data/           # known-services.ts (서비스 자동완성 데이터)
│   │   ├── services/       # ID 생성, 커밋 메시지 빌더 (pause/resume 포함)
│   │   └── components/     # form, card, list, summary, history,
│   │                       # edit-dialog, autocomplete, category-breakdown,
│   │                       # payment-calendar, dashboard-content
│   └── auth/components/    # header.tsx, footer.tsx
└── components/
    ├── ui/                 # button, card, dialog (hideFooter, cancelLabel 옵션)
    └── lang-sync.tsx       # URL 언어를 SettingsProvider에 동기화
```

## 핵심 패턴

- 구독 데이터 → GitHub 레포의 `subscriptions.json`에 저장
- 모든 변경 = GitHub 커밋 (feat: add, chore: update/cancel/pause/resume)
- SHA 기반 낙관적 동시성 제어 (409 Conflict 처리)
- 개별 구독마다 통화 설정 + 글로벌 표시 통화로 환율 변환
- Next.js 16: dynamic route params는 Promise (`await params`)
- 구독 상태: active → paused → active (PUT), cancelled (DELETE만)
- 카테고리: 8종 (entertainment, development, cloud, productivity, music, shopping, news, other)
- 결제 캘린더: monthly는 매월 billing_day, yearly는 billing_month의 billing_day에만 표시
- `subscriptions-updated` 커스텀 DOM 이벤트로 컴포넌트 간 갱신 (커밋 히스토리 등)
- 커밋 히스토리: 접기/펼치기 토글 (기본 닫힘, lazy fetch), AbortController로 중복 요청 취소
- 통화 금액 표시: `tabular-nums` 사용 (`font-mono` 대신)
- toast 패턴: `useRef` 타이머 + `useEffect` cleanup으로 메모리 누수 방지

## 다국어 SEO

- URL 기반 라우팅: `/ko`, `/en`, `/ja`, `/zh`
- 미들웨어 언어 감지: 쿠키(`sublog-lang`) → Accept-Language → 기본값 `ko`
- 언어 변경 시 쿠키 + localStorage + `html[lang]` 동시 업데이트
- `LangSync` 컴포넌트: `[lang]` 라우트 파라미터를 SettingsProvider에 동기화
- `generateMetadata`: 언어별 title/description/OG + `hreflang` alternates + `x-default`
- 사이트맵: 각 언어별 URL + alternates 포함
- 랜딩 페이지 언어 변경 시 `router.replace`로 URL도 변경

## 스키마 (Subscription)

```typescript
{
  id: string,
  name: string,
  price: number,
  currency: "KRW" | "USD" | "JPY" | "EUR" | "CNY",
  cycle: "monthly" | "yearly",
  billing_day: 1~31,
  status: "active" | "paused" | "cancelled",
  pausedUntil?: string (ISO datetime),
  category?: Category,
  billing_month?: 1~12 (yearly만)
}
```

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
- Tailwind v4에서 `@import url()` 사용 금지 → 외부 폰트는 `layout.tsx`의 `<link>` 태그로 로드
- `middleware.ts`는 인증 보호 + 다국어 라우팅을 통합 처리 (`auth()` 래퍼 사용)
- `[lang]` 라우트와 `/dashboard`, `/api` 는 Next.js 정적 라우트 우선 규칙으로 충돌 없음
- `SUPPORTED_LANGS`는 `i18n.ts`에서 `as const`로 단일 정의, 언어 검증은 `isLanguage()` 타입 가드 사용
- `AUTH_SECRET` 검증: 프로덕션 런타임에서만 실행 (Docker 빌드 시 `build-placeholder`는 스킵)
- JSON-LD의 `dangerouslySetInnerHTML`에는 `replace(/</g, "\\u003c")` XSS 방지 필수
- error boundary에서 `error.message` 직접 노출 금지 (내부 정보 유출 방지)
- `readSubscriptions`는 Zod `safeParse`로 외부 데이터 검증 후 사용
- **작업 완료 후 반드시 이 CLAUDE.md를 최신 상태로 업데이트할 것** (파일/구조 변경, 새 패턴, 환경변수 추가 등)

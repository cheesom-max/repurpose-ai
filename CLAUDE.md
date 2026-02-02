# RepurposeAI - 프로젝트 컨텍스트

## 프로젝트 개요

**서비스명**: RepurposeAI
**미션**: "콘텐츠 하나로 일주일치 마케팅을 해결한다"

장문 영상/오디오를 업로드하면 AI가 자동으로 하이라이트를 감지하여
쇼츠, 블로그, 뉴스레터, SNS 포스트를 원클릭으로 생성

## 기술 스택 (Neon + Clerk)

| 영역 | 기술 | 설명 |
|------|------|------|
| Frontend | React + Vite | SPA, Tailwind CSS |
| Backend | Cloudflare Pages Functions | 서버리스 API |
| Database | Neon + Drizzle ORM | 서버리스 PostgreSQL |
| Auth | Clerk | 인증 (10K MAU 무료) |
| Hosting | Cloudflare Pages | 무제한 대역폭, 글로벌 CDN |
| AI | OpenAI Whisper + GPT-4o | 음성 인식 + 텍스트 생성 |
| Payment | Stripe | 구독 결제 |

## 프로젝트 구조

```
app/
├── index.html              # 진입점
├── vite.config.ts          # Vite 설정
├── drizzle.config.ts       # Drizzle ORM 설정
├── wrangler.toml           # Cloudflare 설정
├── functions/              # Cloudflare Pages Functions
│   └── api/
│       ├── health.ts
│       └── projects/
│           ├── index.ts    # GET, POST /api/projects
│           └── [id]/
│               ├── index.ts   # GET /api/projects/:id
│               └── process.ts # POST /api/projects/:id/process
├── src/
│   ├── db/                 # Database
│   │   ├── schema.ts       # Drizzle 스키마
│   │   └── index.ts        # DB 클라이언트
│   └── client/             # React SPA
│       ├── main.tsx
│       ├── App.tsx
│       ├── pages/
│       ├── components/
│       └── lib/
│           ├── api.ts      # API 클라이언트
│           └── clerk.ts    # Clerk 설정
└── drizzle/                # 마이그레이션 파일
```

## 주요 명령어

```bash
npm run dev        # 개발 서버 (Vite)
npm run build      # 프로덕션 빌드
npm run preview    # Wrangler로 로컬 프리뷰
npm run deploy     # Cloudflare Pages 배포

# Database
npm run db:generate  # 마이그레이션 생성
npm run db:push      # 스키마 푸시 (개발용)
npm run db:studio    # Drizzle Studio
```

## 환경 변수

### 클라이언트 (.env)
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_xxx
```

### 서버 (wrangler secret)
```bash
wrangler pages secret put DATABASE_URL
wrangler pages secret put OPENAI_API_KEY
wrangler pages secret put STRIPE_SECRET_KEY
```

## 데이터베이스 스키마 (Drizzle)

- **users**: Clerk 사용자 동기화, 플랜, Stripe 연동
- **projects**: 프로젝트 (영상 URL, 상태, 트랜스크립트)
- **clips**: 추출된 클립 (시작/끝 시간, 점수)
- **contents**: 생성된 콘텐츠 (blog, twitter, linkedin)

## API 엔드포인트

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | /api/health | 헬스 체크 | No |
| GET | /api/projects | 프로젝트 목록 | Yes |
| POST | /api/projects | 프로젝트 생성 | Yes |
| GET | /api/projects/:id | 프로젝트 상세 | Yes |
| POST | /api/projects/:id/process | 영상 처리 시작 | Yes |

## 배포 방법

```bash
# 1. Neon 프로젝트 생성
# https://console.neon.tech 에서 생성

# 2. Clerk 앱 생성
# https://dashboard.clerk.com 에서 생성

# 3. 환경 변수 설정
wrangler pages secret put DATABASE_URL

# 4. DB 스키마 푸시
npm run db:push

# 5. 배포
npm run deploy
```

## Supabase vs Neon+Clerk 비교

| 항목 | Supabase | Neon + Clerk |
|------|----------|--------------|
| DB | PostgreSQL | PostgreSQL (서버리스) |
| Auth | 내장 | Clerk (별도) |
| 무료 프로젝트 | 2개 | **무제한** |
| 무료 Auth | 50K MAU | 10K MAU |
| Edge 최적화 | 보통 | **최적화됨** |

## 현재 진행 상황

- [x] 프로젝트 초기화 (React + Vite)
- [x] 인증 시스템 (Clerk)
- [x] UI 컴포넌트 (Tailwind CSS)
- [x] API 구현 (Pages Functions + Drizzle)
- [x] 데이터베이스 스키마 (Drizzle ORM)
- [ ] Neon 프로젝트 생성 및 마이그레이션
- [ ] Clerk 앱 생성 및 설정
- [ ] Cloudflare Pages 배포

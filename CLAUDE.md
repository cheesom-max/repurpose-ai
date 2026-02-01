# RepurposeAI - 프로젝트 컨텍스트

## 프로젝트 개요

**서비스명**: RepurposeAI
**미션**: "콘텐츠 하나로 일주일치 마케팅을 해결한다"

장문 영상/오디오를 업로드하면 AI가 자동으로 하이라이트를 감지하여
쇼츠, 블로그, 뉴스레터, SNS 포스트를 원클릭으로 생성

## 기술 스택 (Cloudflare 최적화)

| 영역 | 기술 | 설명 |
|------|------|------|
| Frontend | React + Vite | SPA, Tailwind CSS |
| Backend | Hono | Cloudflare Workers에 최적화된 경량 프레임워크 |
| Database | Supabase | PostgreSQL + Auth + Storage |
| Hosting | Cloudflare Pages | 무제한 대역폭, 글로벌 CDN |
| AI | OpenAI Whisper + GPT-4o | 음성 인식 + 텍스트 생성 |
| Payment | Stripe | 구독 결제 |

## 프로젝트 구조

```
app/
├── index.html              # 진입점
├── vite.config.ts          # Vite + Cloudflare 설정
├── wrangler.toml           # Cloudflare 설정
├── functions/              # Cloudflare Pages Functions
│   └── [[path]].ts         # API 라우트 핸들러
├── src/
│   ├── client/             # React SPA
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── components/     # UI 컴포넌트
│   │   └── lib/            # 유틸리티
│   └── server/             # Hono API
│       └── index.ts
└── supabase/
    └── migrations/         # DB 스키마
```

## 주요 명령어

```bash
npm run dev      # 개발 서버 (Vite)
npm run build    # 프로덕션 빌드
npm run preview  # Wrangler로 로컬 프리뷰
npm run deploy   # Cloudflare Pages 배포
```

## 환경 변수

### 클라이언트 (.env)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
```

### 서버 (wrangler.toml 또는 Cloudflare 대시보드)
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
```

## 데이터베이스 스키마

- **users**: 사용자 정보, 플랜, Stripe 연동
- **projects**: 프로젝트 (영상 URL, 상태, 트랜스크립트)
- **clips**: 추출된 클립 (시작/끝 시간, 점수)
- **contents**: 생성된 콘텐츠 (blog, twitter, linkedin)

## API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/health | 헬스 체크 |
| POST | /api/projects/:id/process | 영상 처리 시작 |

## 배포 방법

```bash
# 1. Cloudflare Pages 연결
wrangler pages project create repurpose-ai

# 2. 환경 변수 설정
wrangler pages secret put SUPABASE_URL
wrangler pages secret put SUPABASE_ANON_KEY

# 3. 배포
npm run build && npm run deploy
```

## Vercel vs Cloudflare 비교

| 항목 | Vercel | Cloudflare Pages |
|------|--------|------------------|
| 대역폭 | 100GB/월 | **무제한** |
| 서버리스 | 제한적 | **무제한** |
| 비용 | $20+/월 | **무료** |
| 속도 | 빠름 | **더 빠름** |

## 현재 진행 상황

- [x] 프로젝트 초기화 (Hono + React + Vite)
- [x] 인증 시스템 (Supabase Auth)
- [x] UI 컴포넌트 (Tailwind CSS)
- [x] API 구현 (Hono)
- [ ] Supabase 프로젝트 생성
- [ ] Cloudflare Pages 배포

# Wanco

하루 한 문제로 코딩테스트를 습관으로 만드는 서비스입니다.

## 기능

- 🔐 Google OAuth를 통한 간편한 로그인
- 📅 매일 새로운 코딩테스트 문제 제공
- 🔥 스트릭 시스템으로 꾸준한 학습 유도
- 📊 GitHub 잔디 스타일의 활동 달력
- 📈 통계 대시보드 (총 문제 수, 최고 스트릭, 달성률 등)

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth (Google OAuth)
- **Database**: Supabase (PostgreSQL)

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**자세한 설정 방법은 [ENV_SETUP.md](./ENV_SETUP.md)를 참조하세요.**

### 3. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트를 생성하세요.
2. Authentication > Providers에서 Google OAuth를 활성화하세요.
3. SQL Editor에서 `DATABASE_SCHEMA.md`의 스키마를 실행하세요.
4. Authentication > URL Configuration에서 Redirect URLs에 `http://localhost:3000/auth/callback`을 추가하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
wanco/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx           # 랜딩 페이지 (/)
│   ├── today/             # 오늘의 문제 페이지 (/today)
│   ├── history/           # 기록/통계 페이지 (/history)
│   ├── setup/             # 프로필 설정 페이지 (/setup)
│   └── auth/              # 인증 관련 라우트
├── components/            # React 컴포넌트
├── lib/                   # 유틸리티 및 Supabase 클라이언트
│   ├── supabase/         # Supabase 클라이언트 설정
│   └── utils.ts          # 유틸리티 함수
├── types/                 # TypeScript 타입 정의
└── middleware.ts          # Next.js 미들웨어 (인증 처리)
```

## 데이터베이스 스키마

자세한 데이터베이스 스키마는 [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)를 참조하세요.

## 배포

### Vercel 배포 (권장) ⚡

Vercel은 Next.js를 네이티브로 지원하므로 가장 간단하고 최적화된 배포 방법입니다.

#### 1단계: GitHub에 프로젝트 푸시

```bash
git add .
git commit -m "Vercel 배포 준비"
git push origin main
```

#### 2단계: Vercel에서 프로젝트 Import

1. [Vercel](https://vercel.com)에 로그인하세요.
2. **Add New...** → **Project**를 클릭하세요.
3. GitHub 저장소를 선택하고 **Import**를 클릭하세요.
4. Vercel이 자동으로 Next.js 프로젝트를 감지합니다.

#### 3단계: 환경 변수 설정

Vercel 대시보드의 **Settings** → **Environment Variables**에서 다음 변수를 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**중요**: 
- `NEXT_PUBLIC_*` 변수는 빌드 타임에 번들링되므로, 환경 변수를 설정한 후 **재배포**해야 합니다.
- Production, Preview, Development 환경별로 각각 설정할 수 있습니다.

#### 4단계: 배포 및 Supabase 설정

1. **Deploy** 버튼을 클릭하여 배포를 시작하세요.
2. 배포가 완료되면 Vercel이 제공하는 URL을 확인하세요 (예: `https://your-project.vercel.app`).
3. Supabase 대시보드에서 **Authentication** → **URL Configuration** → **Redirect URLs**에 다음을 추가하세요:
   ```
   https://your-project.vercel.app/auth/callback
   ```

#### 5단계: 커스텀 도메인 설정 (선택사항)

1. Vercel 대시보드에서 **Settings** → **Domains**로 이동하세요.
2. 원하는 도메인을 입력하고 DNS 설정을 따라하세요.

**Vercel의 장점**:
- ✅ Next.js SSR, ISR, Edge Functions 자동 최적화
- ✅ 자동 HTTPS 및 CDN
- ✅ 무료 플랜 제공 (개인 프로젝트에 충분)
- ✅ GitHub 연동으로 자동 배포
- ✅ 프리뷰 배포 (Pull Request마다)
- ✅ 실시간 로그 및 모니터링

자세한 배포 가이드는 [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)를 참조하세요.

## 라이선스

MIT

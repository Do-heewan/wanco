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

### Vercel 배포

1. GitHub에 프로젝트를 푸시하세요.
2. [Vercel](https://vercel.com)에서 프로젝트를 import하세요.
3. 환경 변수를 설정하세요.
4. 배포가 완료되면 Supabase의 Redirect URLs에 프로덕션 URL을 추가하세요.

## 라이선스

MIT

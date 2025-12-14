# 환경 변수 설정 가이드

이 문서는 Wanco 프로젝트의 환경 변수를 설정하는 방법을 설명합니다.

## 1. .env.local 파일 생성

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하세요.

```bash
# 프로젝트 루트에서 실행
touch .env.local
```

## 2. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 계정을 생성하거나 로그인하세요.
2. "New Project" 버튼을 클릭하여 새 프로젝트를 생성하세요.
3. 프로젝트 이름, 데이터베이스 비밀번호, 리전을 설정하고 프로젝트를 생성하세요.

## 3. Supabase API 키 가져오기

1. Supabase 대시보드에서 프로젝트를 선택하세요.
2. 좌측 메뉴에서 **Settings** (⚙️) → **API**를 클릭하세요.
3. 다음 정보를 확인하세요:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`에 사용
   - **anon public key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 사용

## 4. .env.local 파일 작성

`.env.local` 파일을 열고 다음 내용을 작성하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**예시:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example
```

## 5. Google OAuth 설정 (Supabase)

1. Supabase 대시보드에서 **Authentication** → **Providers**를 클릭하세요.
2. **Google**을 찾아 클릭하세요.
3. **Enable Google provider**를 활성화하세요.
4. Google Cloud Console에서 OAuth 2.0 클라이언트 ID를 생성하고:
   - **Client ID (for OAuth)**를 입력
   - **Client Secret (for OAuth)**를 입력
5. **Save**를 클릭하세요.

### Google Cloud Console에서 OAuth 설정하기

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속하세요.
2. 새 프로젝트를 생성하거나 기존 프로젝트를 선택하세요.
3. **APIs & Services** → **Credentials**로 이동하세요.
4. **Create Credentials** → **OAuth client ID**를 클릭하세요.
5. Application type을 **Web application**으로 선택하세요.
6. **Authorized redirect URIs**에 다음을 추가하세요:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
7. 클라이언트 ID와 시크릿을 생성하고 Supabase에 입력하세요.

## 6. Redirect URLs 설정

1. Supabase 대시보드에서 **Authentication** → **URL Configuration**을 클릭하세요.
2. **Redirect URLs**에 다음을 추가하세요:
   - 개발 환경: `http://localhost:3000/auth/callback`
   - 프로덕션 환경: `https://your-domain.com/auth/callback`

## 7. 데이터베이스 스키마 설정

1. Supabase 대시보드에서 **SQL Editor**를 클릭하세요.
2. `DATABASE_SCHEMA.md` 파일의 SQL 스크립트를 복사하여 실행하세요.
3. 테이블과 RLS 정책이 올바르게 생성되었는지 확인하세요.

## 8. 환경 변수 확인

환경 변수가 올바르게 설정되었는지 확인하려면:

```bash
# 개발 서버를 재시작하세요
npm run dev
```

브라우저 콘솔에서 오류가 발생하지 않으면 정상적으로 설정된 것입니다.

## 주의사항

- ⚠️ `.env.local` 파일은 절대 Git에 커밋하지 마세요. (이미 `.gitignore`에 포함되어 있습니다)
- ⚠️ `NEXT_PUBLIC_` 접두사가 붙은 변수는 클라이언트 번들에 포함되므로 민감한 정보는 포함하지 마세요.
- ⚠️ 프로덕션 환경에서는 Vercel 등의 플랫폼에서 환경 변수를 별도로 설정해야 합니다.

## 문제 해결

### 환경 변수를 읽을 수 없다는 오류가 발생하는 경우

1. `.env.local` 파일이 프로젝트 루트에 있는지 확인하세요.
2. 파일 이름이 정확히 `.env.local`인지 확인하세요 (`.env.local.txt`가 아님).
3. 개발 서버를 재시작하세요 (`Ctrl+C` 후 `npm run dev`).

### Supabase 연결 오류가 발생하는 경우

1. Supabase 프로젝트가 활성화되어 있는지 확인하세요.
2. API 키가 올바른지 확인하세요 (공백이나 따옴표가 포함되지 않았는지).
3. Supabase 프로젝트의 URL이 올바른지 확인하세요.


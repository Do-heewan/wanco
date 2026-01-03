# Vercel 배포 가이드

이 가이드는 Wanco 프로젝트를 Vercel에 배포하는 방법을 설명합니다.

## 왜 Vercel인가?

- ✅ **Next.js 네이티브 지원**: Next.js 제작사에서 만든 플랫폼으로 최적화됨
- ✅ **자동 최적화**: SSR, ISR, Edge Functions가 자동으로 최적화됨
- ✅ **간편한 설정**: GitHub 연동만으로 자동 배포
- ✅ **무료 플랜**: 개인 프로젝트에 충분한 무료 플랜 제공
- ✅ **프리뷰 배포**: Pull Request마다 자동으로 프리뷰 URL 생성

## 사전 준비

1. GitHub 계정
2. Vercel 계정 ([vercel.com](https://vercel.com)에서 무료 가입)
3. Supabase 프로젝트 (이미 설정되어 있어야 함)

## 배포 단계

### 1. GitHub에 프로젝트 푸시

```bash
# 변경사항 커밋
git add .
git commit -m "Vercel 배포 준비"

# GitHub에 푸시
git push origin main
```

### 2. Vercel에서 프로젝트 Import

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인
2. **Add New...** → **Project** 클릭
3. GitHub 저장소 목록에서 `wanco` 프로젝트 선택
4. **Import** 클릭

### 3. 프로젝트 설정

Vercel이 자동으로 Next.js 프로젝트를 감지합니다. 다음 설정을 확인하세요:

- **Framework Preset**: Next.js (자동 감지)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (자동 설정)
- **Output Directory**: `.next` (자동 설정)
- **Install Command**: `npm install` (자동 설정)

### 4. 환경 변수 설정

**Settings** → **Environment Variables**에서 다음 변수를 추가하세요:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` | Supabase Anon Key |

**중요 사항**:
- `NEXT_PUBLIC_*` 접두사가 붙은 변수는 **빌드 타임**에 JavaScript 번들에 포함됩니다.
- 환경 변수를 추가한 후에는 **반드시 재배포**해야 합니다.
- Production, Preview, Development 환경별로 각각 설정할 수 있습니다.

### 5. 배포 실행

1. **Deploy** 버튼 클릭
2. 배포 진행 상황을 실시간으로 확인할 수 있습니다
3. 배포가 완료되면 Vercel이 제공하는 URL을 확인하세요 (예: `https://wanco.vercel.app`)

### 6. Supabase Redirect URL 설정

배포가 완료되면 Supabase에서 Redirect URL을 설정해야 합니다:

1. [Supabase 대시보드](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. **Authentication** → **URL Configuration** 이동
4. **Redirect URLs**에 다음을 추가:
   ```
   https://your-project.vercel.app/auth/callback
   ```
5. **Save** 클릭

### 7. 배포 확인

브라우저에서 Vercel이 제공한 URL로 접속하여 다음을 확인하세요:

- ✅ 홈페이지가 정상적으로 로드되는가?
- ✅ Google OAuth 로그인이 작동하는가?
- ✅ 인증 후 리다이렉트가 정상적으로 작동하는가?

## 자동 배포 설정

Vercel은 GitHub와 연동되어 자동으로 배포됩니다:

- **main 브랜치에 푸시**: Production 환경에 자동 배포
- **다른 브랜치에 푸시**: Preview 환경에 자동 배포
- **Pull Request 생성**: PR마다 고유한 프리뷰 URL 생성

## 커스텀 도메인 설정

### 1. 도메인 추가

1. Vercel 대시보드에서 프로젝트 선택
2. **Settings** → **Domains** 이동
3. 원하는 도메인 입력 (예: `wanco.example.com`)
4. **Add** 클릭

### 2. DNS 설정

Vercel이 제공하는 DNS 설정을 따라하세요:

- **A 레코드**: Vercel이 제공하는 IP 주소
- **CNAME 레코드**: Vercel이 제공하는 호스트명

도메인 제공업체의 DNS 설정에서 위 정보를 추가하세요.

### 3. SSL 인증서

Vercel이 자동으로 Let's Encrypt SSL 인증서를 발급하고 관리합니다.

## 환경 변수 관리

### 환경별 설정

Vercel은 세 가지 환경을 지원합니다:

- **Production**: 프로덕션 환경 (main 브랜치)
- **Preview**: 프리뷰 환경 (다른 브랜치, Pull Request)
- **Development**: 로컬 개발 환경 (`vercel dev` 사용 시)

각 환경별로 다른 환경 변수를 설정할 수 있습니다.

### 환경 변수 업데이트

1. **Settings** → **Environment Variables** 이동
2. 수정할 변수 선택
3. 값 수정 후 **Save** 클릭
4. **Redeploy** 클릭하여 재배포

## 모니터링 및 로그

### 실시간 로그 확인

1. Vercel 대시보드에서 프로젝트 선택
2. **Deployments** 탭에서 배포 선택
3. **Functions** 또는 **Build Logs** 탭에서 로그 확인

### 성능 모니터링

Vercel 대시보드의 **Analytics** 탭에서 다음을 확인할 수 있습니다:

- 페이지뷰
- 요청 수
- 응답 시간
- 에러율

## 문제 해결

### 빌드 실패

1. **Build Logs** 확인
2. 환경 변수가 올바르게 설정되었는지 확인
3. `package.json`의 의존성이 올바른지 확인

### 환경 변수 문제

- `NEXT_PUBLIC_*` 변수는 빌드 타임에 포함되므로, 환경 변수를 추가한 후 **반드시 재배포**해야 합니다.
- 환경 변수 이름에 오타가 없는지 확인하세요.

### 인증 문제

- Supabase Redirect URL이 올바르게 설정되었는지 확인
- Supabase 프로젝트의 Google OAuth 설정이 올바른지 확인

## 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Supabase 인증 가이드](https://supabase.com/docs/guides/auth)

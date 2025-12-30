# Railway 배포 가이드 (Docker 이미지 배포)

이 문서는 Wanco 프로젝트를 Docker 이미지로 빌드하여 Railway에 배포하는 방법을 설명합니다.

## 사전 준비

1. [Railway](https://railway.app) 계정 생성
2. [Docker Hub](https://hub.docker.com) 계정 생성 (또는 다른 컨테이너 레지스트리)
3. Docker가 로컬에 설치되어 있어야 함
4. **맥북 ARM64 사용자**: Docker buildx가 활성화되어 있어야 함 (일반적으로 Docker Desktop에 포함됨)

### 맥북 ARM64 사용자를 위한 사전 설정

Railway는 주로 Linux amd64 플랫폼을 사용하므로, ARM64 맥북에서 빌드할 때는 크로스 플랫폼 빌드가 필요합니다:

```bash
# buildx builder 생성 (처음 한 번만)
docker buildx create --name multiarch --use

# 또는 기본 builder 사용
docker buildx inspect --bootstrap
```

## 배포 단계

### 방법 1: Docker Hub를 통한 배포 (권장)

#### 1단계: Docker 이미지 빌드

**⚠️ 중요: 환경 변수는 빌드 타임에 포함되어야 함**

Next.js는 `NEXT_PUBLIC_*` 변수를 빌드 시에 JavaScript에 번들링합니다. 따라서 **반드시 빌드 타임에 환경 변수를 전달해야 합니다**.

```bash
# 프로젝트 루트에서 실행
# Supabase URL과 키를 실제 값으로 변경하세요

docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here" \
  -t wanco:latest .
```

**맥북 ARM64 사용자**: Railway는 Linux amd64를 사용하므로 크로스 플랫폼 빌드를 권장합니다:

```bash
docker buildx build \
  --platform linux/amd64 \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here" \
  -t wanco:latest \
  -o type=docker .
```

#### 2단계: Docker Hub에 로그인

```bash
docker login
# Docker Hub 사용자명과 비밀번호 입력
```

#### 3단계: 이미지 태깅 및 푸시

```bash
# 이미지에 Docker Hub 태그 추가 (your-dockerhub-username을 실제 사용자명으로 변경)
docker tag wanco:latest your-dockerhub-username/wanco:latest

# Docker Hub에 푸시
docker push your-dockerhub-username/wanco:latest
```

#### 4단계: Railway 프로젝트 생성

1. [Railway 대시보드](https://railway.app/dashboard)에 로그인
2. **"New Project"** 클릭
3. **"Deploy from Docker Hub"** 선택 (또는 **"Empty Project"** 선택 후 Docker 이미지 추가)
4. Docker Hub 이미지 이름 입력: `your-dockerhub-username/wanco:latest`

#### 5단계: 환경 변수 설정

**⚠️ 중요**: Docker 빌드 시 이미 환경 변수를 포함했다면, Railway에서 추가 설정은 필요 없습니다.

만약 빌드 타임에 환경 변수를 포함하지 않았다면, Railway 대시보드에서:

1. **Variables** 탭 클릭
2. 다음 환경 변수를 추가:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **그러나 이 경우 클라이언트 사이드 에러가 발생할 수 있습니다**. 반드시 빌드 타임에 환경 변수를 포함하는 것을 권장합니다.
- **환경 변수 설정 후 Railway가 자동으로 재배포하지만, Docker 이미지를 사용하는 경우 수동으로 재배포가 필요할 수 있습니다**

**환경 변수 확인 방법:**
- Railway 대시보드 → **Variables** 탭에서 변수가 올바르게 표시되는지 확인
- 배포 후 브라우저 콘솔에서 오류가 없는지 확인

#### 6단계: 배포 확인

1. Railway가 자동으로 이미지를 pull하고 배포를 시작합니다
2. **Deployments** 탭에서 배포 상태 확인
3. 배포 완료 후 생성된 도메인으로 접속 테스트

### 방법 2: Railway CLI를 통한 배포

#### 1단계: Railway CLI 설치

```bash
# macOS
brew install railway

# 또는 npm으로 설치
npm i -g @railway/cli
```

#### 2단계: Railway에 로그인

```bash
railway login
```

#### 3단계: 프로젝트 초기화

```bash
# 프로젝트 루트에서 실행
railway init
```

#### 4단계: Docker 이미지 빌드 및 배포

**맥북 ARM64 사용자**: `--platform linux/amd64` 옵션 사용 권장

```bash
# 이미지 빌드 (크로스 플랫폼)
docker buildx build --platform linux/amd64 -t wanco:latest --load .

# Railway에 배포
railway up --dockerfile Dockerfile
```

또는 Railway가 자동으로 Dockerfile을 감지하도록:

```bash
railway up
```

#### 5단계: 환경 변수 설정

```bash
# CLI를 통한 환경 변수 설정
railway variables set NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
railway variables set NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

또는 Railway 대시보드의 Variables 탭에서 설정할 수 있습니다.

### 방법 3: GitHub Container Registry (GHCR) 사용

#### 1단계: GitHub Personal Access Token 생성

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. `write:packages` 권한으로 토큰 생성

#### 2단계: Docker Hub 대신 GHCR에 푸시

**맥북 ARM64 사용자**: `--platform linux/amd64` 옵션 사용

```bash
# GHCR에 로그인
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# 이미지 빌드 및 푸시 (크로스 플랫폼)
docker buildx build --platform linux/amd64 \
  -t ghcr.io/YOUR_GITHUB_USERNAME/wanco:latest \
  --push .
```

#### 3단계: Railway에서 GHCR 이미지 사용

Railway 프로젝트 생성 시 이미지 이름을 `ghcr.io/YOUR_GITHUB_USERNAME/wanco:latest`로 입력

### 커스텀 도메인 설정 (선택사항)

1. 프로젝트 설정에서 **Settings** → **Networking** 클릭
2. **Custom Domain** 섹션에서 도메인 추가
3. DNS 설정 가이드에 따라 DNS 레코드 추가

## Supabase Redirect URL 업데이트

Railway 배포 후 Supabase 설정을 업데이트해야 합니다:

1. Supabase 대시보드 → **Authentication** → **URL Configuration**
2. **Redirect URLs**에 Railway 도메인 추가:
   ```
   https://your-railway-domain.railway.app/auth/callback
   ```
3. **Site URL**도 Railway 도메인으로 업데이트 (선택사항)

## 문제 해결

### 빌드 실패

- Dockerfile이 올바른지 확인
- `next.config.ts`에 `output: 'standalone'` 설정 확인
- Railway 로그에서 오류 메시지 확인

### 환경 변수 오류

**"Application error: a client-side exception has occurred" 오류 발생 시:**

이 오류는 주로 환경 변수가 제대로 설정되지 않았을 때 발생합니다.

1. **Railway Variables 확인:**
   - Railway 대시보드 → 프로젝트 선택 → **Variables** 탭
   - 다음 변수가 모두 설정되어 있는지 확인:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
     ```
   - 변수 이름이 정확한지 확인 (대소문자 구분)
   - 값에 따옴표나 공백이 없는지 확인

2. **환경 변수 재설정:**
   - 변수를 삭제하고 다시 추가
   - Railway가 환경 변수 변경을 감지하여 자동으로 재배포합니다

3. **Docker 이미지 재빌드:**
   - 환경 변수는 빌드 타임에 번들에 포함되므로, 이미지를 재빌드해야 할 수 있습니다
   ```bash
   # 로컬에서 재빌드 및 푸시
   ./deploy.sh
   ```
   - 또는 Railway에서 **Settings** → **Redeploy** 클릭

4. **브라우저 콘솔 확인:**
   - 브라우저 개발자 도구 (F12) → Console 탭
   - "Missing Supabase environment variables" 오류 메시지 확인
   - 이 메시지가 보이면 환경 변수가 제대로 설정되지 않은 것입니다

5. **Railway 로그 확인:**
   - Railway 대시보드 → **Deployments** → 최신 배포 선택 → **View Logs**
   - 환경 변수 관련 오류 메시지 확인

6. **해결 방법:**
   
   **옵션 A: 빌드 타임에 환경 변수 포함 (권장)**
   ```bash
   # 로컬에서 환경 변수를 포함하여 재빌드
   docker buildx build \
     --platform linux/amd64 \
     --build-arg NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co" \
     --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here" \
     -t wanco:latest \
     --load .
   
   # Docker Hub에 푸시
   docker tag wanco:latest your-dockerhub-username/wanco:latest
   docker push your-dockerhub-username/wanco:latest
   
   # Railway에서 재배포
   ```
   
   **옵션 B: Railway에서 환경 변수 설정 후 재배포**
   - Railway Variables 탭에서 환경 변수 확인
   - **Settings** → **Redeploy** 클릭하여 재배포
   - 또는 새 이미지를 푸시하여 자동 재배포

### 런타임 오류

- Railway 로그 확인: **Deployments** → 배포 선택 → **View Logs**
- Supabase 연결 확인
- 포트 설정 확인 (Railway는 자동으로 PORT 환경 변수 설정)

### 맥북 ARM64 관련 오류

**"exec format error" 또는 플랫폼 불일치 오류 발생 시:**

1. `--platform linux/amd64` 옵션으로 재빌드:
   ```bash
   docker buildx build --platform linux/amd64 -t wanco:latest --load .
   ```

2. buildx가 제대로 설정되었는지 확인:
   ```bash
   docker buildx inspect --bootstrap
   ```

3. Docker Desktop에서 buildx가 활성화되어 있는지 확인 (Settings → Features in development → Use containerd)

**빌드가 느린 경우:**
- 크로스 플랫폼 빌드는 네이티브 빌드보다 시간이 오래 걸릴 수 있습니다
- 이는 정상적인 현상이며, QEMU 에뮬레이션을 사용하기 때문입니다

## 이미지 업데이트 및 재배포

이미지를 업데이트한 후 Railway에 재배포하는 방법:

### Docker Hub 사용 시

**맥북 ARM64 사용자**: `--platform linux/amd64` 옵션 사용

```bash
# 1. 이미지 재빌드 (크로스 플랫폼)
docker buildx build --platform linux/amd64 -t wanco:latest --load .

# 2. 새 버전 태깅 (버전 관리 권장)
docker tag wanco:latest your-dockerhub-username/wanco:v1.0.1
docker tag wanco:latest your-dockerhub-username/wanco:latest

# 3. Docker Hub에 푸시
docker push your-dockerhub-username/wanco:v1.0.1
docker push your-dockerhub-username/wanco:latest

# 4. Railway 대시보드에서 "Redeploy" 클릭하거나
#    Railway가 자동으로 최신 이미지를 감지하여 재배포합니다
```

### Railway CLI 사용 시

```bash
# 이미지 재빌드 후
railway up
```

## 로컬에서 Docker 테스트

배포 전 로컬에서 Docker 이미지를 테스트할 수 있습니다:

**맥북 ARM64 사용자 참고**: 
- 로컬 테스트는 네이티브 ARM64로 빌드해도 되지만, Railway 배포용은 반드시 `--platform linux/amd64`로 빌드하세요
- 로컬 테스트와 Railway 배포용 빌드를 구분하는 것을 권장합니다

```bash
# 방법 1: 로컬 테스트용 (네이티브 빌드, 빠름)
docker build -t wanco:local .

# 방법 2: Railway 배포용 테스트 (크로스 플랫폼, 실제 배포 환경과 동일)
docker buildx build --platform linux/amd64 -t wanco:latest --load .

# 컨테이너 실행
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your-url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
  wanco:latest
```

브라우저에서 `http://localhost:3000`으로 접속하여 테스트하세요.

## 배포 스크립트 (선택사항)

빠른 배포를 위한 스크립트를 만들 수 있습니다:

### deploy.sh

이미 생성된 `deploy.sh` 스크립트는 맥북 ARM64 환경을 고려하여 작성되었습니다.

사용법:
```bash
chmod +x deploy.sh
./deploy.sh v1.0.1  # 버전 지정
./deploy.sh          # latest 태그 사용
```

**참고**: 스크립트는 자동으로 `--platform linux/amd64` 옵션을 사용하여 Railway 호환 이미지를 빌드합니다.

## 참고사항

- Railway는 무료 플랜에서 월 5달러 크레딧 제공
- 자동 배포: GitHub에 푸시하면 자동으로 재배포됩니다
- Railway는 HTTPS를 자동으로 제공합니다
- 환경 변수 변경 시 자동으로 재배포됩니다


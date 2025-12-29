#!/bin/bash

# Docker Hub 사용자명 설정 (여기를 수정하세요)
DOCKER_USERNAME="your-dockerhub-username"
IMAGE_NAME="wanco"
VERSION=${1:-latest}

# 플랫폼 설정 (Railway는 주로 Linux amd64 사용)
# 맥북 ARM64에서 빌드 시 크로스 플랫폼 빌드를 위해 linux/amd64 지정
PLATFORM="linux/amd64"

echo "🚀 Building Docker image for ${PLATFORM}..."
echo "💡 Note: Building for Railway (Linux amd64) from ARM64 Mac..."

# buildx가 사용 가능한지 확인
if ! docker buildx version &> /dev/null; then
    echo "❌ Docker buildx is not available. Please enable buildx in Docker Desktop."
    exit 1
fi

# buildx builder 초기화 (필요한 경우)
echo "🔧 Checking buildx builder..."
docker buildx inspect --bootstrap &> /dev/null || {
    echo "⚠️  Creating buildx builder..."
    docker buildx create --name multiarch --use 2>/dev/null || docker buildx use default
    docker buildx inspect --bootstrap
}

# 환경 변수 확인 (선택사항 - 빌드 타임에 포함하려면 설정)
# 빌드 타임에 환경 변수를 포함하려면 아래 주석을 해제하고 값을 설정하세요
# BUILD_ARG_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-}"
# BUILD_ARG_SUPABASE_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}"

# buildx를 사용하여 크로스 플랫폼 빌드
# 환경 변수가 설정되어 있으면 빌드 타임에 전달
if [ -n "$BUILD_ARG_SUPABASE_URL" ] && [ -n "$BUILD_ARG_SUPABASE_KEY" ]; then
  echo "📦 Building with environment variables..."
  docker buildx build \
    --platform ${PLATFORM} \
    --build-arg NEXT_PUBLIC_SUPABASE_URL="$BUILD_ARG_SUPABASE_URL" \
    --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$BUILD_ARG_SUPABASE_KEY" \
    -t ${IMAGE_NAME}:${VERSION} \
    --load .
else
  echo "⚠️  Building without build-time environment variables..."
  echo "   Note: Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Railway!"
  docker buildx build --platform ${PLATFORM} -t ${IMAGE_NAME}:${VERSION} --load .
fi

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "🏷️  Tagging image..."
docker tag ${IMAGE_NAME}:${VERSION} ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}
docker tag ${IMAGE_NAME}:${VERSION} ${DOCKER_USERNAME}/${IMAGE_NAME}:latest

echo "📤 Pushing to Docker Hub..."
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest

if [ $? -ne 0 ]; then
    echo "❌ Push failed! Make sure you're logged in to Docker Hub."
    echo "   Run: docker login"
    exit 1
fi

echo "✅ Deployment complete!"
echo "📝 Please redeploy on Railway dashboard or run: railway up"


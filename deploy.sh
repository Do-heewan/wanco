#!/bin/bash

# Docker 빌드 및 실행 스크립트
# 사용법: bash deploy.sh [build-and-run|build|run]
# .env.local 파일에서 자동으로 환경 변수를 읽습니다

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# .env.local 파일에서 환경 변수 로드
load_env_file() {
  if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local 파일을 찾을 수 없습니다.${NC}"
    echo ""
    echo ".env.local 파일을 생성하세요:"
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here"
    echo ""
    exit 1
  fi

  # .env.local 파일 파싱
  while IFS='=' read -r key value; do
    # 주석과 빈 줄 무시
    [[ "$key" =~ ^#.*$ ]] && continue
    [[ -z "$key" ]] && continue

    # 좌우 공백 제거
    key=$(echo "$key" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    value=$(echo "$value" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

    # 따옴표 제거
    value=$(echo "$value" | sed "s/^['\"]//;s/['\"]$//")

    export "$key=$value"
  done < .env.local

  echo -e "${GREEN}✅ .env.local 파일에서 환경 변수를 로드했습니다.${NC}"
}

# 환경 변수 검증
check_env() {
  if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}❌ 필수 환경 변수가 누락되었습니다.${NC}"
    echo ""
    echo "다음 변수가 .env.local에 설정되어야 합니다:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo ""
    exit 1
  fi
  
  echo "  NEXT_PUBLIC_SUPABASE_URL: $NEXT_PUBLIC_SUPABASE_URL"
  echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:0:20}..."
}

# Docker 빌드
build_image() {
  echo -e "${YELLOW}🔨 Docker 이미지를 빌드 중입니다...${NC}"
  echo ""
  
  docker build \
    --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
    --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    -t wanco:latest .
  
  if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ 빌드 완료!${NC}"
  else
    echo ""
    echo -e "${RED}❌ 빌드 실패!${NC}"
    exit 1
  fi
}

# Docker 이미지 실행
run_container() {
  echo -e "${YELLOW}🚀 컨테이너를 실행 중입니다... (포트 3000)${NC}"
  echo ""
  echo "http://localhost:3000 에 접속하세요"
  echo "종료하려면 Ctrl+C를 누르세요"
  echo ""
  
  docker run -p 3000:3000 \
    -e NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
    -e NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    wanco:latest
}

# 메인 로직
echo ""
echo -e "${YELLOW}🚀 환경 변수 로드 중...${NC}"
load_env_file
echo ""
echo -e "${YELLOW}🚀 환경 변수 확인:${NC}"
check_env
echo ""

case "${1:-build-and-run}" in
  build-and-run)
    build_image
    run_container
    ;;
  build)
    build_image
    ;;
  run)
    echo -e "${YELLOW}🚀 컨테이너를 실행 중입니다... (포트 3000)${NC}"
    docker run -p 3000:3000 wanco:latest
    ;;
  *)
    echo "사용법: bash $0 {build-and-run|build|run}"
    echo ""
    echo "옵션:"
    echo "  build-and-run : .env.local에서 환경 변수를 읽어 빌드하고 실행 (기본값)"
    echo "  build         : .env.local에서 환경 변수를 읽어 빌드만 수행"
    echo "  run           : 기존 이미지로 컨테이너 실행"
    echo ""
    echo "예시:"
    echo "  bash deploy.sh"
    echo "  bash deploy.sh build"
    ;;
esac

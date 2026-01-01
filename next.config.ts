import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Railway 배포를 위한 서버 설정
  // 환경 변수를 통해 포트와 호스트를 설정할 수 있도록 함
};

export default nextConfig;

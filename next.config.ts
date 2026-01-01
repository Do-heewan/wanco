import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Railway 배포를 위해 standalone 모드 대신 커스텀 서버 사용
  // output: 'standalone',
};

export default nextConfig;

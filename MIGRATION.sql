-- 플랫폼별 테이블 생성 마이그레이션 스크립트
-- 기존 daily_problems 테이블의 데이터를 플랫폼별 테이블로 이전합니다.

-- 1. 플랫폼별 문제 테이블 생성

-- BOJ 문제 테이블
CREATE TABLE IF NOT EXISTS boj_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ruby')),
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 프로그래머스 문제 테이블
CREATE TABLE IF NOT EXISTS programmers_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Lv. 1', 'Lv. 2', 'Lv. 3', 'Lv. 4', 'Lv. 5')),
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- LeetCode 문제 테이블
CREATE TABLE IF NOT EXISTS leetcode_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 기존 daily_problems 테이블의 데이터를 플랫폼별 테이블로 이전

-- BOJ 문제 이전
INSERT INTO boj_problems (id, title, difficulty, url, created_at)
SELECT id, title, difficulty, url, created_at
FROM daily_problems
WHERE platform = 'BOJ'
ON CONFLICT (id) DO NOTHING;

-- 프로그래머스 문제는 난이도 형식이 다르므로 수동으로 처리해야 합니다
-- 기존 데이터가 있다면 아래와 같이 수동으로 처리하세요:
-- INSERT INTO programmers_problems (id, title, difficulty, url, created_at)
-- SELECT id, title, 'Lv. 1'::TEXT, url, created_at
-- FROM daily_problems
-- WHERE platform = 'Programmers';

-- LeetCode 문제 이전 (난이도 매핑 필요)
-- INSERT INTO leetcode_problems (id, title, difficulty, url, created_at)
-- SELECT id, title, 'Easy'::TEXT, url, created_at
-- FROM daily_problems
-- WHERE platform = 'LC';

-- 3. 새로운 daily_problems 테이블 구조로 변경

-- 기존 daily_problems 테이블 백업 (선택사항)
CREATE TABLE IF NOT EXISTS daily_problems_backup AS 
SELECT * FROM daily_problems;

-- 기존 daily_problems 테이블 삭제 (주의: 데이터는 이미 백업됨)
-- DROP TABLE IF EXISTS daily_problems CASCADE;

-- 새로운 daily_problems 테이블 생성
CREATE TABLE IF NOT EXISTS daily_problems_new (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL CHECK (platform IN ('BOJ', 'Programmers', 'LC')),
  problem_id UUID NOT NULL,
  date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기존 데이터를 새 구조로 마이그레이션 (BOJ만, 다른 플랫폼은 수동 처리 필요)
INSERT INTO daily_problems_new (id, platform, problem_id, date, created_at)
SELECT id, platform, id as problem_id, date, created_at
FROM daily_problems
WHERE platform = 'BOJ';

-- 기존 테이블 이름 변경 및 새 테이블 적용
-- ALTER TABLE daily_problems RENAME TO daily_problems_old;
-- ALTER TABLE daily_problems_new RENAME TO daily_problems;

-- 4. RLS 정책 추가

ALTER TABLE boj_problems ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can view BOJ problems" ON boj_problems;
CREATE POLICY "Authenticated users can view BOJ problems"
  ON boj_problems FOR SELECT
  TO authenticated
  USING (true);

ALTER TABLE programmers_problems ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can view Programmers problems" ON programmers_problems;
CREATE POLICY "Authenticated users can view Programmers problems"
  ON programmers_problems FOR SELECT
  TO authenticated
  USING (true);

ALTER TABLE leetcode_problems ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can view LeetCode problems" ON leetcode_problems;
CREATE POLICY "Authenticated users can view LeetCode problems"
  ON leetcode_problems FOR SELECT
  TO authenticated
  USING (true);

-- daily_problems RLS는 기존 정책이 있다면 재생성
-- ALTER TABLE daily_problems ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Authenticated users can view problems" ON daily_problems;
-- CREATE POLICY "Authenticated users can view daily problems"
--   ON daily_problems FOR SELECT
--   TO authenticated
--   USING (true);

-- 5. 인덱스 생성 (선택사항)

CREATE INDEX IF NOT EXISTS idx_boj_problems_difficulty ON boj_problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_programmers_problems_difficulty ON programmers_problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_leetcode_problems_difficulty ON leetcode_problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_daily_problems_platform ON daily_problems(platform);
CREATE INDEX IF NOT EXISTS idx_daily_problems_date ON daily_problems(date);


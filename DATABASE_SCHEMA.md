# 데이터베이스 스키마

이 문서는 Supabase 데이터베이스 스키마를 설명합니다.

## 테이블 구조

### 1. user_profiles

사용자 프로필 정보를 저장하는 테이블입니다.

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  target_difficulty TEXT NOT NULL CHECK (target_difficulty IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ruby')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**
- `id`: 사용자 ID (auth.users 테이블의 id와 동일)
- `nickname`: 사용자 닉네임
- `target_difficulty`: 목표 난이도 (Bronze, Silver, Gold, Platinum, Diamond, Ruby)
- `created_at`: 프로필 생성 시간

### 2. daily_problems

매일 제공되는 문제 정보를 저장하는 테이블입니다.

```sql
CREATE TABLE daily_problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL CHECK (platform IN ('BOJ', 'Programmers', 'LC')),
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ruby')),
  url TEXT NOT NULL,
  date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**컬럼 설명:**
- `id`: 문제 ID
- `platform`: 플랫폼 (BOJ, Programmers, LC)
- `title`: 문제 제목
- `difficulty`: 난이도
- `url`: 문제 링크
- `date`: 문제가 제공되는 날짜 (YYYY-MM-DD 형식)
- `created_at`: 생성 시간

### 3. user_progress

사용자의 문제 풀이 진행 상황을 저장하는 테이블입니다.

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES daily_problems(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

**컬럼 설명:**
- `id`: 진행 기록 ID
- `user_id`: 사용자 ID
- `problem_id`: 문제 ID
- `date`: 완료한 날짜 (YYYY-MM-DD 형식)
- `completed_at`: 완료 시간

**인덱스:**
```sql
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_date ON user_progress(date);
CREATE INDEX idx_user_progress_user_date ON user_progress(user_id, date);
```

## Row Level Security (RLS) 정책

### user_profiles

```sql
-- 모든 사용자는 자신의 프로필을 읽을 수 있음
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);
```

### daily_problems

```sql
-- 모든 인증된 사용자는 문제를 읽을 수 있음
ALTER TABLE daily_problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view problems"
  ON daily_problems FOR SELECT
  TO authenticated
  USING (true);
```

### user_progress

```sql
-- 사용자는 자신의 진행 기록만 읽고 쓸 수 있음
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## 초기 데이터 설정

매일 문제를 추가하려면 다음 SQL을 실행하세요:

```sql
INSERT INTO daily_problems (platform, title, difficulty, url, date)
VALUES ('BOJ', '문제 제목', 'Bronze', 'https://www.acmicpc.net/problem/1234', '2024-01-01');
```


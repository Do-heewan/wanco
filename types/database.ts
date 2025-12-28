export type Platform = 'BOJ' | 'Programmers' | 'LC'

export type BOJDifficulty = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Ruby'
export type ProgrammersDifficulty = 'Lv. 1' | 'Lv. 2' | 'Lv. 3' | 'Lv. 4' | 'Lv. 5'
export type LeetCodeDifficulty = 'Easy' | 'Medium' | 'Hard'

// 하위 호환성을 위해 유지 (기본적으로 BOJ 난이도)
export type Difficulty = BOJDifficulty

export interface BOJProblem {
  id: string
  title: string
  difficulty: BOJDifficulty
  url: string
  created_at: string
}

export interface ProgrammersProblem {
  id: string
  title: string
  difficulty: ProgrammersDifficulty
  url: string
  created_at: string
}

export interface LeetCodeProblem {
  id: string
  title: string
  difficulty: LeetCodeDifficulty
  url: string
  created_at: string
}

export interface DailyProblem {
  id: string
  platform: Platform
  problem_id: string
  date: string
  created_at: string
}

// 통합된 Problem 타입 (플랫폼별 문제 정보 포함)
export interface Problem {
  id: string
  platform: Platform
  title: string
  difficulty: BOJDifficulty | ProgrammersDifficulty | LeetCodeDifficulty
  url: string
  date: string
}

export interface UserProfile {
  id: string
  nickname: string
  target_difficulty: Difficulty
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  problem_id: string
  completed_at: string
  date: string
}


export type Platform = 'BOJ' | 'Programmers' | 'LC'

export type Difficulty = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Ruby'

export interface Problem {
  id: string
  platform: Platform
  title: string
  difficulty: Difficulty
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


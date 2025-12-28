'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Problem } from '@/types/database'

interface TodayProblemProps {
  problem: Problem | null
  isCompleted: boolean
  streak: number
  userId: string
}

const platformIcons: Record<string, string> = {
  BOJ: '📚',
  Programmers: '💼',
  LC: '🌐',
}

function getDifficultyClassName(platform: string, difficulty: string): string {
  if (platform === 'BOJ') {
    switch (difficulty) {
      case 'Bronze':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
      case 'Silver':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
      case 'Gold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Platinum':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200'
      case 'Diamond':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Ruby':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  } else if (platform === 'Programmers') {
    switch (difficulty) {
      case 'Lv. 1':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Lv. 2':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Lv. 3':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Lv. 4':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'Lv. 5':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  } else if (platform === 'LC') {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    }
  }
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}

export default function TodayProblem({ problem, isCompleted, streak, userId }: TodayProblemProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handleComplete = async () => {
    if (!problem || isCompleted || isSubmitting) return

    setIsSubmitting(true)
    try {
      const today = new Date().toISOString().split('T')[0]

      const { error } = await supabase.from('user_progress').insert({
        user_id: userId,
        problem_id: problem.id,
        date: today,
        completed_at: new Date().toISOString(),
      })

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('완료 처리 오류:', error)
      alert('완료 처리에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!problem) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            오늘의 문제가 아직 준비되지 않았습니다.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* 상단: 날짜 및 스트릭 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{today}</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 dark:bg-orange-900">
          <span className="text-xl">🔥</span>
          <span className="font-semibold text-orange-800 dark:text-orange-200">
            {streak} days
          </span>
        </div>
      </div>

      {/* 중앙: 문제 정보 */}
      <div className="rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-4xl">{platformIcons[problem.platform] || '📝'}</span>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{problem.platform}</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {problem.title}
            </h2>
          </div>
        </div>

        <div className="mb-6">
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${getDifficultyClassName(
              problem.platform,
              problem.difficulty
            )}`}
          >
            {problem.difficulty}
          </span>
        </div>

        <a
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-6 block w-full rounded-lg bg-indigo-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          문제 풀러 가기
        </a>

        {/* 하단: 완료 버튼 */}
        <button
          onClick={handleComplete}
          disabled={isCompleted || isSubmitting}
          className={`w-full rounded-lg px-6 py-3 font-semibold transition-colors ${
            isCompleted
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
              : 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50'
          }`}
        >
          {isCompleted ? '✅ 풀었어요 (완료)' : isSubmitting ? '처리 중...' : '풀었어요'}
        </button>
      </div>

      {/* 네비게이션 */}
      <div className="mt-6 text-center">
        {/* <a
          href="/history"
          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          기록 보기 →
        </a> */}
      </div>
    </div>
  )
}


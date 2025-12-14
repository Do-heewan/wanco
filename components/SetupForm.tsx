'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Difficulty } from '@/types/database'

const difficulties: Difficulty[] = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ruby']

interface SetupFormProps {
  userId: string
}

export default function SetupForm({ userId }: SetupFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [nickname, setNickname] = useState('')
  const [targetDifficulty, setTargetDifficulty] = useState<Difficulty>('Bronze')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.from('user_profiles').insert({
        id: userId,
        nickname,
        target_difficulty: targetDifficulty,
      })

      if (error) throw error

      router.push('/today')
      router.refresh()
    } catch (error) {
      console.error('프로필 생성 오류:', error)
      alert('프로필 생성에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="nickname"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          닉네임
        </label>
        <input
          id="nickname"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="닉네임을 입력하세요"
        />
      </div>

      <div>
        <label
          htmlFor="difficulty"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          목표 난이도
        </label>
        <select
          id="difficulty"
          value={targetDifficulty}
          onChange={(e) => setTargetDifficulty(e.target.value as Difficulty)}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {difficulties.map((diff) => (
            <option key={diff} value={diff}>
              {diff}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading || !nickname.trim()}
        className="w-full rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? '설정 중...' : '시작하기'}
      </button>
    </form>
  )
}


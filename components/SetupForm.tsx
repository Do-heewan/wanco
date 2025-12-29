'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Difficulty, UserProfile } from '@/types/database'

const difficulties: Difficulty[] = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ruby']

interface SetupFormProps {
  userId: string
  initialProfile: UserProfile | null
}

export default function SetupForm({ userId, initialProfile }: SetupFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [nickname, setNickname] = useState(initialProfile?.nickname || '')
  const [targetDifficulty, setTargetDifficulty] = useState<Difficulty>(
    initialProfile?.target_difficulty || 'Bronze'
  )
  const [isLoading, setIsLoading] = useState(false)

  // 초기 프로필 데이터가 변경되면 상태 업데이트
  useEffect(() => {
    if (initialProfile) {
      setNickname(initialProfile.nickname)
      setTargetDifficulty(initialProfile.target_difficulty)
    }
  }, [initialProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // upsert를 사용하여 프로필이 있으면 업데이트, 없으면 생성
      const { error } = await supabase.from('user_profiles').upsert({
        id: userId,
        nickname,
        target_difficulty: targetDifficulty,
      })

      if (error) throw error

      router.refresh()
      alert('프로필이 저장되었습니다.')
    } catch (error) {
      console.error('프로필 저장 오류:', error)
      alert('프로필 저장에 실패했습니다. 다시 시도해주세요.')
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
        {isLoading ? '저장 중...' : '저장하기'}
      </button>
    </form>
  )
}


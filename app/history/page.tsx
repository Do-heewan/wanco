import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import HistoryView from '@/components/HistoryView'
import LogoutButton from '@/components/LogoutButton'
import { calculateStreak } from '@/lib/utils'

export default async function HistoryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // 프로필 확인
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/setup')
  }

  // 모든 진행 기록 가져오기
  const { data: allProgress } = await supabase
    .from('user_progress')
    .select('date')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  const progressDates = new Set((allProgress || []).map((p) => p.date))

  // 통계 계산
  const totalProblems = allProgress?.length || 0
  const streak = calculateStreak(allProgress || [])

  // 이번 달 달성률 계산
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const thisMonthProgress = (allProgress || []).filter((p) => {
    const date = new Date(p.date)
    return (
      date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
    )
  }).length
  const monthlyRate = Math.round((thisMonthProgress / daysInMonth) * 100)

  // 최고 스트릭 계산 (간단한 버전)
  let maxStreak = 0
  let currentStreak = 0
  const sortedDates = [...(allProgress || [])]
    .map((p) => p.date)
    .sort()
    .filter((date, index, arr) => arr.indexOf(date) === index)

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      currentStreak = 1
    } else {
      const prevDate = new Date(sortedDates[i - 1])
      const currDate = new Date(sortedDates[i])
      const diffDays = Math.floor(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (diffDays === 1) {
        currentStreak++
      } else {
        maxStreak = Math.max(maxStreak, currentStreak)
        currentStreak = 1
      }
    }
  }
  maxStreak = Math.max(maxStreak, currentStreak)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4 flex justify-end">
          <LogoutButton />
        </div>
        <HistoryView
          progressDates={progressDates}
          totalProblems={totalProblems}
          currentStreak={streak}
          maxStreak={maxStreak}
          monthlyRate={monthlyRate}
        />
      </div>
    </div>
  )
}


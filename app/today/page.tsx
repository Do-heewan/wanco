import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TodayProblem from '@/components/TodayProblem'
import { calculateStreak, getTodayDateString } from '@/lib/utils'

export default async function TodayPage() {
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

  // 오늘의 문제 가져오기
  const today = getTodayDateString()
  const { data: todayProblem } = await supabase
    .from('daily_problems')
    .select('*')
    .eq('date', today)
    .single()

  // 오늘 완료 여부 확인
  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .single()

  // 스트릭 계산
  const { data: allProgress } = await supabase
    .from('user_progress')
    .select('date')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  const streak = calculateStreak(allProgress || [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <TodayProblem
          problem={todayProblem}
          isCompleted={!!progress}
          streak={streak}
          userId={user.id}
        />
      </div>
    </div>
  )
}


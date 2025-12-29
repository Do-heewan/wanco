import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TodayProblem from '@/components/TodayProblem'
import { calculateStreak, getTodayDateString } from '@/lib/utils'
import type { Problem, DailyProblem } from '@/types/database'

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
  const { data: dailyProblem, error: dailyProblemError } = await supabase
    .from('daily_problems')
    .select('*')
    .eq('date', today)
    .maybeSingle()

  // 플랫폼별 문제 정보 가져오기
  let todayProblem: Problem | null = null

  if (dailyProblem && !dailyProblemError) {
    const dailyProblemData = dailyProblem as DailyProblem

    if (dailyProblemData.platform === 'BOJ') {
      const { data: bojProblem, error: bojError } = await supabase
        .from('boj_problems')
        .select('*')
        .eq('id', dailyProblemData.problem_id)
        .maybeSingle()

      if (!bojError && bojProblem) {
        todayProblem = {
          id: dailyProblemData.id,
          platform: 'BOJ',
          title: bojProblem.title,
          difficulty: bojProblem.difficulty,
          url: bojProblem.url,
          date: dailyProblemData.date,
        }
      }
    } else if (dailyProblemData.platform === 'Programmers') {
      const { data: programmersProblem, error: programmersError } = await supabase
        .from('programmers_problems')
        .select('*')
        .eq('id', dailyProblemData.problem_id)
        .maybeSingle()

      if (!programmersError && programmersProblem) {
        todayProblem = {
          id: dailyProblemData.id,
          platform: 'Programmers',
          title: programmersProblem.title,
          difficulty: programmersProblem.difficulty,
          url: programmersProblem.url,
          date: dailyProblemData.date,
        }
      }
    } else if (dailyProblemData.platform === 'LC') {
      const { data: leetcodeProblem, error: leetcodeError } = await supabase
        .from('leetcode_problems')
        .select('*')
        .eq('id', dailyProblemData.problem_id)
        .maybeSingle()

      if (!leetcodeError && leetcodeProblem) {
        todayProblem = {
          id: dailyProblemData.id,
          platform: 'LC',
          title: leetcodeProblem.title,
          difficulty: leetcodeProblem.difficulty,
          url: leetcodeProblem.url,
          date: dailyProblemData.date,
        }
      }
    }
  }

  // 오늘 완료 여부 확인 (daily_problems의 id를 사용)
  let progress = null
  if (dailyProblem) {
    const { data } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('problem_id', dailyProblem.id)
      .eq('date', today)
      .maybeSingle()
    progress = data
  }

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


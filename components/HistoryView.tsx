'use client'

import Link from 'next/link'
import { useMemo } from 'react'

interface HistoryViewProps {
  progressDates: Set<string>
  totalProblems: number
  currentStreak: number
  maxStreak: number
  monthlyRate: number
}

export default function HistoryView({
  progressDates,
  totalProblems,
  currentStreak,
  maxStreak,
  monthlyRate,
}: HistoryViewProps) {
  // 최근 365일 달력 생성
  const calendar = useMemo(() => {
    const days: { date: Date; hasProgress: boolean }[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 최근 365일 생성
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      days.push({
        date,
        hasProgress: progressDates.has(dateStr),
      })
    }

    // 주 단위로 그룹화
    const weeks: { date: Date; hasProgress: boolean }[][] = []
    let currentWeek: { date: Date; hasProgress: boolean }[] = []

    days.forEach((day, index) => {
      const dayOfWeek = day.date.getDay()
      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek)
        currentWeek = [day]
      } else {
        currentWeek.push(day)
      }
    })

    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    return weeks
  }, [progressDates])

  const getIntensity = (hasProgress: boolean, date: Date): string => {
    if (!hasProgress) return 'bg-gray-100 dark:bg-gray-800'

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === 0) return 'bg-green-500 dark:bg-green-600'
    if (daysDiff <= 7) return 'bg-green-400 dark:bg-green-500'
    if (daysDiff <= 30) return 'bg-green-300 dark:bg-green-400'
    return 'bg-green-200 dark:bg-green-300'
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">기록 & 통계</h1>
        {/* <Link
          href="/today"
          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          ← 오늘의 문제
        </Link> */}
      </div>

      {/* 통계 카드 */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">총 문제 수</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {totalProblems}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">현재 스트릭</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentStreak}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">days</span>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">최고 스트릭</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {maxStreak}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">이번 달 달성률</div>
          <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {monthlyRate}%
          </div>
        </div>
      </div>

      {/* 달력 뷰 */}
      <div className="rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          활동 달력
        </h2>
        <div className="overflow-x-auto">
          <div className="flex gap-1">
            {calendar.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`h-3 w-3 rounded ${getIntensity(day.hasProgress, day.date)}`}
                    title={day.date.toLocaleDateString('ko-KR')}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded bg-gray-100 dark:bg-gray-800" />
            <div className="h-3 w-3 rounded bg-green-200 dark:bg-green-300" />
            <div className="h-3 w-3 rounded bg-green-300 dark:bg-green-400" />
            <div className="h-3 w-3 rounded bg-green-400 dark:bg-green-500" />
            <div className="h-3 w-3 rounded bg-green-500 dark:bg-green-600" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  )
}


'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

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
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  // 사용 가능한 연도 목록 생성 (기록이 있는 연도들)
  const availableYears = useMemo(() => {
    const years = new Set<number>()
    progressDates.forEach((dateStr) => {
      const year = new Date(dateStr).getFullYear()
      years.add(year)
    })
    // 현재 연도와 기록이 있는 연도들을 합침
    years.add(currentYear)
    return Array.from(years).sort((a, b) => b - a)
  }, [progressDates, currentYear])

  // 선택한 연도의 달력 생성
  const calendar = useMemo(() => {
    const days: { date: Date; hasProgress: boolean }[] = []
    
    // 선택한 연도의 1월 1일부터 12월 31일까지
    const startDate = new Date(selectedYear, 0, 1)
    const endDate = new Date(selectedYear, 11, 31)
    
    // 해당 연도의 첫 번째 일요일 찾기 (달력 시작점)
    const firstDayOfYear = new Date(selectedYear, 0, 1)
    const firstSunday = new Date(firstDayOfYear)
    firstSunday.setDate(firstSunday.getDate() - firstDayOfYear.getDay())
    
    // 해당 연도의 마지막 토요일 찾기 (달력 종료점)
    const lastDayOfYear = new Date(selectedYear, 11, 31)
    const lastSaturday = new Date(lastDayOfYear)
    lastSaturday.setDate(lastSaturday.getDate() + (6 - lastDayOfYear.getDay()))
    
    // 첫 번째 일요일부터 마지막 토요일까지 모든 날짜 생성
    const currentDate = new Date(firstSunday)
    while (currentDate <= lastSaturday) {
      const dateStr = currentDate.toISOString().split('T')[0]
      days.push({
        date: new Date(currentDate),
        hasProgress: progressDates.has(dateStr) && 
                     currentDate >= startDate && 
                     currentDate <= endDate,
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // 주 단위로 그룹화 (7일씩)
    const weeks: { date: Date; hasProgress: boolean }[][] = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    return weeks
  }, [progressDates, selectedYear])

  const getIntensity = (hasProgress: boolean, date: Date): string => {
    // 선택한 연도 범위를 벗어나는 날짜는 투명하게 처리
    const startDate = new Date(selectedYear, 0, 1)
    const endDate = new Date(selectedYear, 11, 31)
    if (date < startDate || date > endDate) {
      return 'opacity-0 pointer-events-none'
    }

    if (!hasProgress) return 'bg-gray-100'

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const daysDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === 0) return 'bg-green-500'
    if (daysDiff <= 7) return 'bg-green-400'
    if (daysDiff <= 30) return 'bg-green-300'
    return 'bg-green-200'
  }

  // 선택한 연도의 통계 계산
  const yearStats = useMemo(() => {
    const yearProgress = Array.from(progressDates).filter((dateStr) => {
      const year = new Date(dateStr).getFullYear()
      return year === selectedYear
    })
    
    return {
      total: yearProgress.length,
      dates: new Set(yearProgress),
    }
  }, [progressDates, selectedYear])

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">기록 & 통계</h1>
        {/* <Link
          href="/today"
          className="text-indigo-600 hover:text-indigo-700"
        >
          ← 오늘의 문제
        </Link> */}
      </div>

      {/* 통계 카드 */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="text-sm text-gray-600">총 문제 수</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {totalProblems}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="text-sm text-gray-600">현재 스트릭</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-3xl font-bold text-gray-900">
              {currentStreak}
            </span>
            <span className="text-sm text-gray-600">days</span>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="text-sm text-gray-600">최고 스트릭</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {maxStreak}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="text-sm text-gray-600">이번 달 달성률</div>
          <div className="mt-2 text-3xl font-bold text-gray-900">
            {monthlyRate}%
          </div>
        </div>
      </div>

      {/* 달력 뷰 */}
      <div className="rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            활동 달력
          </h2>
          <div className="text-sm text-gray-600">
            {selectedYear}년 총 {yearStats.total}일 문제를 풀었습니다.
          </div>
        </div>
        <div className="flex items-start gap-6">
          {/* 달력 */}
          <div className="flex-1">
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
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="h-3 w-3 rounded bg-gray-100" />
                <div className="h-3 w-3 rounded bg-green-200" />
                <div className="h-3 w-3 rounded bg-green-300" />
                <div className="h-3 w-3 rounded bg-green-400" />
                <div className="h-3 w-3 rounded bg-green-500" />
              </div>
              <span>More</span>
            </div>
          </div>
          {/* 연도 선택 버튼 */}
          <div className="flex flex-col gap-2">
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`text-base font-medium px-4 py-2 rounded-md transition-colors text-left ${
                  selectedYear === year
                    ? 'text-gray-900 font-semibold'
                    : 'text-gray-300 hover:text-gray-500 hover:bg-gray-50'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


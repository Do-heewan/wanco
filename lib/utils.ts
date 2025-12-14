export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]
}

export function calculateStreak(progress: { date: string }[]): number {
  if (progress.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dates = progress
    .map((p) => new Date(p.date))
    .map((d) => {
      d.setHours(0, 0, 0, 0)
      return d
    })
    .sort((a, b) => b.getTime() - a.getTime())

  let streak = 0
  let currentDate = new Date(today)

  for (const date of dates) {
    const dateStr = date.toISOString().split('T')[0]
    const currentStr = currentDate.toISOString().split('T')[0]

    if (dateStr === currentStr) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (date < currentDate) {
      break
    }
  }

  return streak
}


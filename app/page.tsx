import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl">
            하루 한 문제로
            <br />
            코딩테스트를 습관으로
          </h1>
          
          <div className="mt-8 flex flex-col gap-4 text-lg text-gray-700">
            <p className="font-medium">🔥 매일 새로운 문제로 실력을 키우세요</p>
            <p className="font-medium">📊 스트릭과 통계로 성장을 확인하세요</p>
            <p className="font-medium">🎯 목표 난이도에 맞춘 맞춤형 문제</p>
          </div>

          {user && (
            <Link
              href="/today"
              className="mt-8 rounded-lg bg-indigo-600 px-8 py-4 text-xl font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl"
            >
              오늘의 문제 풀러가기! 🚀
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SetupForm from '@/components/SetupForm'
import type { Difficulty } from '@/types/database'

export default async function SetupPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // 이미 프로필이 있으면 /today로 리다이렉트
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile) {
    redirect('/today')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          프로필 설정
        </h1>
        <SetupForm userId={user.id} />
      </main>
    </div>
  )
}


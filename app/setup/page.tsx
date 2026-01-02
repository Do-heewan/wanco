import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SetupForm from '@/components/SetupForm'

export default async function SetupPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // 프로필 정보 가져오기 (있을 수도 있고 없을 수도 있음)
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          마이페이지
        </h1>
        <SetupForm userId={user.id} initialProfile={profile || null} />
      </main>
    </div>
  )
}


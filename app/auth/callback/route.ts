import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!

const { searchParams } = new URL(request.url)
const code = searchParams.get('code')

const nextParam = searchParams.get('next')
const next =
  nextParam && nextParam.startsWith('/')
    ? nextParam
    : '/today'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // 사용자 프로필 확인
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        // 프로필이 없으면 설정 페이지로
        if (!profile) {
          return NextResponse.redirect(new URL('/setup', SITE_URL))
        }

        return NextResponse.redirect(new URL(next, SITE_URL))
      }
    }
  }

  // 오류 발생 시 홈으로 리다이렉트
  return NextResponse.redirect(new URL('/', SITE_URL))
}


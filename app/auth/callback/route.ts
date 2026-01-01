import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || `${requestUrl.protocol}//${requestUrl.host}`

  const { searchParams } = requestUrl
  const code = searchParams.get('code')

  const nextParam = searchParams.get('next')
  const next =
    nextParam && nextParam.startsWith('/')
      ? nextParam
      : '/today'

  if (code) {
    let response = NextResponse.next()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )

            response = NextResponse.next({ request })

            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

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

        // 최종 리다이렉트 URL 결정
        const redirectUrl = !profile ? '/setup' : next

        // 쿠키가 설정된 리다이렉트 응답 생성
        const redirectResponse = NextResponse.redirect(new URL(redirectUrl, SITE_URL))
        
        // 설정된 쿠키를 리다이렉트 응답에 복사
        response.cookies.getAll().forEach(({ name }) => {
          const cookie = response.cookies.get(name)
          if (cookie) {
            redirectResponse.cookies.set(name, cookie.value, cookie)
          }
        })

        return redirectResponse
      }
    }
  }

  // 오류 발생 시 홈으로 리다이렉트
  return NextResponse.redirect(new URL('/', SITE_URL))
}


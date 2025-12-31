import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const pathname = request.nextUrl.pathname
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!

  // 1. 인증/콜백 경로는 절대 가로채지 않는다
  if (
    pathname === '/' ||
    pathname.startsWith('/auth')
  ) {
    return response
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 2. 보호된 페이지 접근 제어
  if (!user) {
    return NextResponse.redirect(new URL('/', SITE_URL))
  }

  return response
}

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import NavLinks from './NavLinks'
import LogoutButton from './LogoutButton'
import LoginButton from './LoginButton'

export default async function Navigation() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* 로고/홈 */}
          <Link
            href='/'
            className="flex items-center gap-2 text-xl font-bold text-gray-900 transition-colors hover:text-indigo-600"
          >
            <span>🔥</span>
            <span className="hidden sm:inline">Wanco</span>
          </Link>

          {/* 네비게이션 링크 - 로그인된 경우에만 표시 */}
          {user && <NavLinks />}

          {/* 로그인/로그아웃 버튼 */}
          <div className="flex items-center">
            {user ? <LogoutButton /> : <LoginButton />}
          </div>
        </div>
      </div>
    </nav>
  )
}

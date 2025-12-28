'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLinks() {
  const pathname = usePathname()

  const links = [
    { href: '/today', label: '오늘의 문제' },
    { href: '/history', label: '기록' },
  ]

  return (
    <div className="flex items-center gap-1">
      {links.map((link) => {
        const isActive = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}


'use client'

import { Home, BookOpen, Upload, MessageSquare, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

const navigation = [
  { name: 'Beranda', href: '/', icon: Home },
  { name: 'Perpustakaan', href: '/library', icon: BookOpen },
  { name: 'Upload', href: '/upload', icon: Upload },
  { name: 'Forum', href: '/forum', icon: MessageSquare },
  { name: 'Profil', href: '/profile', icon: User },
]

export default function BottomNav() {
  const pathname = usePathname()

  // Don't show on auth pages or reader pages
  if (pathname?.startsWith('/auth') || pathname?.startsWith('/reader/')) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-secondary-200 bottom-nav safe-area-bottom lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname?.startsWith(item.href))
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex flex-col items-center justify-center flex-1 h-full touch-target transition-colors duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-accent hover:text-accent-dark'
              )}
            >
              <Icon className={clsx('w-6 h-6 mb-0.5', isActive && 'scale-110')} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

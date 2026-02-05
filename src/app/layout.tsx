import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import TopNav from '@/components/TopNav'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'Turosa - Kitab Learning App',
  description: 'Media belajar Kitab Kuning dengan teknologi modern. Platform pembelajaran digital untuk mengakses, membaca, dan mempelajari Kitab Kuning dengan AI dan OCR.',
  keywords: ['kitab kuning', 'pembelajaran islam', 'kitab digital', 'pesantren', 'kitab arab', 'turosa'],
  authors: [{ name: 'Turosa Team' }],
  creator: 'Turosa',
  publisher: 'Turosa',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://turosa.vercel.app',
    title: 'Turosa - Kitab Learning App',
    description: 'Media belajar Kitab Kuning dengan teknologi modern',
    siteName: 'Turosa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turosa - Kitab Learning App',
    description: 'Media belajar Kitab Kuning dengan teknologi modern',
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Turosa',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#059669',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-secondary antialiased">
        <TopNav />
        <main className="pt-16 pb-20 lg:pb-6 min-h-screen">
          {children}
        </main>
        <BottomNav />
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  )
}


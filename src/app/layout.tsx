import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

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
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-secondary antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}

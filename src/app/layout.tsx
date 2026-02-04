import type { Metadata } from 'next'
import { Amiri } from 'next/font/google'
import './globals.css'

const amiri = Amiri({ 
  weight: ['400', '700'],
  subsets: ['arabic', 'latin'],
  variable: '--font-amiri',
})

export const metadata: Metadata = {
  title: 'Turosa - Kitab Learning App',
  description: 'Media belajar Kitab Kuning dengan teknologi modern',
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
        <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${amiri.variable} font-sans bg-secondary antialiased`}>
        {children}
      </body>
    </html>
  )
}

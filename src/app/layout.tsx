import type { Metadata } from 'next'
import './globals.css'

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
      <body className="font-sans bg-secondary antialiased">
        {children}
      </body>
    </html>
  )
}

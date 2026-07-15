import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'YallaGrow - Growth Marketing Agency',
  description: 'Strategy, social media, paid ads, and content — built for startups and small businesses ready to grow.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import CookieBanner from '@/components/ui/CookieBanner'
import MaintenanceGate from '@/components/MaintenanceGate'

export const metadata: Metadata = {
  title: 'YallaGrow — We Build Growth',
  description: "Lebanon's premium growth marketing agency. Strategy, social media, paid ads, branding, content creation, and website development tailored for your business.",
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'YallaGrow — We Build Growth',
    description: "Lebanon's premium growth marketing agency.",
    url: 'https://yallagrow.net',
    siteName: 'YallaGrow',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="VKjEKzcMxf43uDoLCiOJwNVekJzz3vxD7nC0xnyXQLk" />
      </head>
      <body>
        <MaintenanceGate>
          <Navbar />
          <main>{children}</main>
          <CookieBanner />
        </MaintenanceGate>
      </body>
    </html>
  )
}

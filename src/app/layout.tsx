import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import CookieBanner from '@/components/ui/CookieBanner'
import MaintenanceGate from '@/components/MaintenanceGate'
import SupportBot from '@/components/ui/SupportBot'
import { ToastProvider } from '@/components/ui/Toast'

export const metadata: Metadata = {
  title: 'YallaGrow — We Build Growth',
  description: "Lebanon's premium growth marketing agency. Strategy, social media, paid ads, branding, content creation, and website development tailored for your business.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
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
        <meta name="apple-mobile-web-app-title" content="YallaGrow" />
      </head>
      <body>
        <ToastProvider>
          <MaintenanceGate>
            <Navbar />
            <main>{children}</main>
            <CookieBanner />
            <SupportBot />
          </MaintenanceGate>
        </ToastProvider>
      </body>
    </html>
  )
}

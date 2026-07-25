import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import CookieBanner from '@/components/ui/CookieBanner'
import MaintenanceGate from '@/components/MaintenanceGate'
import SupportBot from '@/components/ui/SupportBot'
import ScrollAnimator from '@/components/ui/ScrollAnimator'
import ExitIntentPopup from '@/components/ui/ExitIntentPopup'
import { ToastProvider } from '@/components/ui/Toast'

export const metadata: Metadata = {
  metadataBase: new URL('https://yallagrow.net'),
  title: {
    default: 'YallaGrow — Lebanon\'s Premium Growth Marketing Agency',
    template: '%s | YallaGrow',
  },
  description: "Lebanon's premium growth marketing agency. Strategy, social media, paid ads, branding, content creation, and website development tailored for your business.",
  keywords: ['marketing agency Lebanon', 'social media management', 'digital marketing Beirut', 'paid ads Lebanon', 'branding', 'content creation', 'website development'],
  authors: [{ name: 'YallaGrow' }],
  creator: 'YallaGrow',
  publisher: 'YallaGrow',
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
    description: "Lebanon's premium growth marketing agency. Strategy, social media, paid ads, branding, and websites tailored for your business.",
    url: 'https://yallagrow.net',
    siteName: 'YallaGrow',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YallaGrow — We Build Growth',
    description: "Lebanon's premium growth marketing agency.",
  },
  alternates: {
    canonical: 'https://yallagrow.net',
  },
}

// JSON-LD structured data for Organization + LocalBusiness
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://yallagrow.net/#organization',
      name: 'YallaGrow',
      url: 'https://yallagrow.net',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yallagrow.net/apple-touch-icon.png',
        width: 512,
        height: 512,
      },
      sameAs: [
        'https://www.linkedin.com/company/yallagroww/',
        'https://www.instagram.com/yallagrow_/',
        'https://www.facebook.com/profile.php?id=61579169077154',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+44-7376-441603',
        contactType: 'customer service',
        email: 'info@yallagrow.net',
        availableLanguage: ['English', 'Arabic'],
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://yallagrow.net/#localbusiness',
      name: 'YallaGrow Marketing Agency',
      image: 'https://yallagrow.net/apple-touch-icon.png',
      url: 'https://yallagrow.net',
      telephone: '+44-7376-441603',
      email: 'info@yallagrow.net',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'LB',
        addressLocality: 'Beirut',
      },
      description: "Lebanon's premium growth marketing agency offering social media management, paid advertising, branding, content creation, and website development.",
    },
    {
      '@type': 'WebSite',
      '@id': 'https://yallagrow.net/#website',
      url: 'https://yallagrow.net',
      name: 'YallaGrow',
      description: "Lebanon's premium growth marketing agency",
      publisher: {
        '@id': 'https://yallagrow.net/#organization',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="VKjEKzcMxf43uDoLCiOJwNVekJzz3vxD7nC0xnyXQLk" />
        <meta name="apple-mobile-web-app-title" content="YallaGrow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <ToastProvider>
          <MaintenanceGate>
            <Navbar />
            <main>{children}</main>
            <CookieBanner />
            <SupportBot />
            <ScrollAnimator />
            <ExitIntentPopup />
          </MaintenanceGate>
        </ToastProvider>
      </body>
    </html>
  )
}

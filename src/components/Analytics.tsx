// src/components/Analytics.tsx
'use client'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, Suspense } from 'react'

const GA_ID = 'G-HYJM165KQK'

interface GtagWindow extends Window {
  gtag?: (command: string, action: string, params?: Record<string, unknown>) => void
}

function AnalyticsInner() {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return
    const w = window as GtagWindow
    if (typeof w.gtag === 'function') {
      w.gtag('config', GA_ID, { page_path: pathname })
    }
  }, [pathname])

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            anonymize_ip: true,
          });
        `}
      </Script>
    </>
  )
}

export default function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsInner />
    </Suspense>
  )
}

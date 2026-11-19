'use client'
// Admin layout — thin auth gate only. The V35 shell with sidebar +
// topbar lives inside the admin page itself so each sub-page can
// swap seamlessly without remounting the shell.
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  // Login route bypasses the gate so it doesn't render null.
  const isLoginRoute = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginRoute) {
      setChecking(false)
      return
    }
    const session = sessionStorage.getItem('yg_admin')
    if (session === 'true') {
      setAuthed(true)
    } else {
      router.push('/admin/login')
    }
    setChecking(false)
  }, [router, isLoginRoute])

  if (isLoginRoute) return <>{children}</>
  if (checking) return null
  if (!authed) return null

  return <>{children}</>
}

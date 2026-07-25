'use client'
import { useEffect } from 'react'

/**
 * ScrollAnimator - client-side IntersectionObserver
 * 
 * Automatically fades in every <section> on the page as it scrolls
 * into view. Works in all modern browsers. Runs once on mount.
 */
export default function ScrollAnimator() {
  useEffect(() => {
    // Respect user motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll<HTMLElement>('section').forEach(s => {
        s.style.opacity = '1'
        s.style.transform = 'none'
      })
      return
    }

    // Apply initial hidden state to all sections
    const sections = document.querySelectorAll<HTMLElement>('section')
    sections.forEach(s => {
      s.style.opacity = '0'
      s.style.transform = 'translateY(30px)'
      s.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
    })

    // Observe each section
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            target.style.opacity = '1'
            target.style.transform = 'translateY(0)'
            observer.unobserve(target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )

    sections.forEach(s => observer.observe(s))

    // Handle sections added dynamically (e.g. after route change)
    const mutationObserver = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>('section').forEach(s => {
        if (!s.dataset.animObserved) {
          s.dataset.animObserved = 'true'
          if (!s.style.opacity) {
            s.style.opacity = '0'
            s.style.transform = 'translateY(30px)'
            s.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            observer.observe(s)
          }
        }
      })
    })

    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  return null
}

'use client'
// Interactive spider-web canvas background.
// Nodes are laid out on a polar grid (N spokes × R concentric rings).
// Each frame, every node runs a spring-damper toward its rest position
// AND gets pushed away from the cursor if within a radius. Lines are
// drawn between neighbors so the whole web flexes when you move the
// mouse through it.
//
// Pure canvas — zero React re-renders after mount. 60fps on any phone
// made in the last 5 years.

import { useEffect, useRef } from 'react'

interface Node {
  // rest polar
  angle: number
  radius: number
  // rest cartesian (cached)
  rx: number
  ry: number
  // current cartesian (what we draw)
  x: number
  y: number
  // velocity
  vx: number
  vy: number
}

export default function SpiderWeb() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const ctx2d = canvasEl.getContext('2d')
    if (!ctx2d) return
    // Rebind to non-nullable locals so TS keeps the narrowing inside
    // the nested tick/resize/handler closures below.
    const canvas: HTMLCanvasElement = canvasEl
    const ctx: CanvasRenderingContext2D = ctx2d

    const SPOKES = 14              // radial spokes
    const RINGS = 7                // concentric rings
    const INTERACT_RADIUS = 130    // px — cursor influence range
    const INTERACT_FORCE = 260     // impulse magnitude when cursor is near a node
    const SPRING = 0.028           // pull toward rest
    const DAMPING = 0.78           // velocity decay

    let width = 0, height = 0, dpr = 1
    let cx = 0, cy = 0              // web center
    let maxRadius = 0
    const nodes: Node[] = []

    // Mouse / touch
    const mouse = { x: -9999, y: -9999, active: false }

    function buildWeb() {
      nodes.length = 0
      // smaller inner ring + growing outer rings for spider-web geometry
      for (let s = 0; s < SPOKES; s++) {
        for (let r = 1; r <= RINGS; r++) {
          const angle = (s / SPOKES) * Math.PI * 2
          // non-linear radius: tighter inner rings, looser outer
          const t = r / RINGS
          const radius = maxRadius * Math.pow(t, 1.4)
          const rx = cx + Math.cos(angle) * radius
          const ry = cy + Math.sin(angle) * radius
          nodes.push({
            angle, radius,
            rx, ry,
            x: rx, y: ry,
            vx: 0, vy: 0,
          })
        }
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cx = width / 2
      cy = height / 2
      maxRadius = Math.min(width, height) * 0.45
      buildWeb()
    }

    function nodeAt(spoke: number, ring: number): Node {
      // ring is 1-indexed in buildWeb (r=1..RINGS), so index offset -1
      return nodes[((spoke + SPOKES) % SPOKES) * RINGS + (ring - 1)]
    }

    function tick() {
      // Update physics
      for (const n of nodes) {
        // Spring toward rest
        const dx = n.rx - n.x
        const dy = n.ry - n.y
        n.vx += dx * SPRING
        n.vy += dy * SPRING

        // Cursor repulsion
        if (mouse.active) {
          const mx = n.x - mouse.x
          const my = n.y - mouse.y
          const dist2 = mx * mx + my * my
          if (dist2 < INTERACT_RADIUS * INTERACT_RADIUS) {
            const dist = Math.sqrt(dist2) || 1
            const falloff = 1 - dist / INTERACT_RADIUS
            const push = (INTERACT_FORCE * falloff) / dist
            n.vx += mx * push * 0.016
            n.vy += my * push * 0.016
          }
        }

        n.vx *= DAMPING
        n.vy *= DAMPING
        n.x += n.vx
        n.y += n.vy
      }

      // Draw
      ctx.clearRect(0, 0, width, height)

      // Background glow at center
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius * 1.2)
      glow.addColorStop(0, 'rgba(16,161,219,0.08)')
      glow.addColorStop(1, 'rgba(16,161,219,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)

      // Radial spokes (connect ring 1 → RINGS along each spoke, and
      // also from ring 1 inward to center)
      ctx.strokeStyle = 'rgba(16,161,219,0.28)'
      ctx.lineWidth = 0.9
      for (let s = 0; s < SPOKES; s++) {
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        for (let r = 1; r <= RINGS; r++) {
          const n = nodeAt(s, r)
          ctx.lineTo(n.x, n.y)
        }
        ctx.stroke()
      }

      // Concentric arcs — connect each ring across spokes
      ctx.strokeStyle = 'rgba(16,161,219,0.22)'
      ctx.lineWidth = 0.7
      for (let r = 1; r <= RINGS; r++) {
        ctx.beginPath()
        for (let s = 0; s <= SPOKES; s++) {
          const n = nodeAt(s % SPOKES, r)
          if (s === 0) ctx.moveTo(n.x, n.y)
          else ctx.lineTo(n.x, n.y)
        }
        ctx.stroke()
      }

      // Faint node dots
      ctx.fillStyle = 'rgba(16,161,219,0.5)'
      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, 1.2, 0, Math.PI * 2)
        ctx.fill()
      }

      // Center dot
      ctx.fillStyle = 'rgba(16,161,219,0.9)'
      ctx.beginPath()
      ctx.arc(cx, cy, 2.4, 0, Math.PI * 2)
      ctx.fill()

      raf = requestAnimationFrame(tick)
    }

    let raf = 0

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }
    const onLeave = () => { mouse.active = false }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.touches[0].clientX - rect.left
      mouse.y = e.touches[0].clientY - rect.top
      mouse.active = true
    }
    const onTouchEnd = () => { mouse.active = false }

    resize()
    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

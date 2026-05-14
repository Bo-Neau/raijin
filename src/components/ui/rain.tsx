import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface RainBackgroundProps {
  /** Number of raindrops. 200–400 looks great on canvas without lag. */
  intensity?: number
  /** Fall speed multiplier. 0.4 = drizzle, 1.0 = steady, 1.6 = downpour. */
  speed?: number
  /** Stroke color. */
  color?: string
  /** Wind angle in degrees. Positive = lean right. */
  angle?: number
  /** Drop thickness range in CSS pixels. */
  dropSize?: { min: number; max: number }
  /** Drop length range in CSS pixels. */
  dropLength?: { min: number; max: number }
  className?: string
  children?: React.ReactNode
}

interface Drop {
  x: number
  y: number
  v: number       // vertical velocity (px/frame at 60fps baseline)
  len: number     // drop length
  w: number       // stroke width
  opacity: number
}

/**
 * Canvas-based rain. One <canvas> element, all drops drawn per frame via
 * requestAnimationFrame — drastically smoother than rendering 500 animated
 * DOM nodes. Respects device pixel ratio (capped at 2) and the user's
 * prefers-reduced-motion setting (stops the loop).
 *
 * Lightning/thunder are intentionally NOT part of this — Raijin's existing
 * strike system handles those.
 */
export function RainBackground({
  intensity = 250,
  speed = 1,
  color = "rgba(174, 194, 224, 0.55)",
  angle = 10,
  dropSize = { min: 0.8, max: 1.6 },
  dropLength = { min: 10, max: 22 },
  className,
  children,
}: RainBackgroundProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dropsRef = useRef<Drop[]>([])
  const rafRef = useRef<number>(0)
  const lastTRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapperRef.current
    if (!canvas || !wrap) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const rand = (min: number, max: number) => Math.random() * (max - min) + min
    const seedDrop = (h: number): Drop => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * h, // start scattered so first frame isn't bunched at top
      v: rand(4, 8) * speed,
      len: rand(dropLength.min, dropLength.max),
      w: rand(dropSize.min, dropSize.max),
      opacity: rand(0.3, 0.85),
    })

    // Drop reset: only x is randomized; y starts above the viewport
    const reset = (d: Drop) => {
      d.x = Math.random() * canvas.clientWidth
      d.y = -d.len - Math.random() * 60
      d.v = rand(4, 8) * speed
      d.len = rand(dropLength.min, dropLength.max)
      d.w = rand(dropSize.min, dropSize.max)
      d.opacity = rand(0.3, 0.85)
    }

    const resize = () => {
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // (Re-)seed drop pool to fill current canvas
      const target = intensity
      while (dropsRef.current.length < target) dropsRef.current.push(seedDrop(h))
      while (dropsRef.current.length > target) dropsRef.current.pop()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    // Pre-compute the wind drift per pixel of fall
    const tilt = Math.tan((angle * Math.PI) / 180)

    const draw = (t: number) => {
      // Frame-rate independent stepping (target ~60fps → dt≈1)
      const dt = lastTRef.current ? Math.min((t - lastTRef.current) / 16.67, 2.5) : 1
      lastTRef.current = t

      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)

      ctx.strokeStyle = color
      ctx.lineCap = "round"

      const drops = dropsRef.current
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i]
        d.y += d.v * dt
        d.x += d.v * tilt * dt

        if (d.y > h + d.len) {
          reset(d)
          continue
        }
        if (d.x > w + d.len) d.x = -d.len
        if (d.x < -d.len) d.x = w + d.len

        ctx.globalAlpha = d.opacity
        ctx.lineWidth = d.w
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x - tilt * d.len, d.y - d.len)
        ctx.stroke()
      }
      ctx.globalAlpha = 1

      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [intensity, speed, color, angle, dropSize.min, dropSize.max, dropLength.min, dropLength.max])

  return (
    <div ref={wrapperRef} className={cn("relative overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

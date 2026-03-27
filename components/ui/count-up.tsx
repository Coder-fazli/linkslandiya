"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface CountUpProps {
  value: number
  duration?: number
  separator?: string
  suffix?: string
  prefix?: string
  className?: string
  colorScheme?: "default" | "gradient"
}

export function CountUp({
  value,
  duration = 2,
  separator = ",",
  suffix = "",
  prefix = "",
  className,
  colorScheme = "default",
}: CountUpProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true
        const start = performance.now()
        const ms = duration * 1000
        const tick = (now: number) => {
          const p = Math.min((now - start) / ms, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setCount(Math.floor(eased * value))
          if (p < 1) requestAnimationFrame(tick)
          else setCount(value)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [value, duration])

  const formatted = count.toLocaleString("en-US").replace(/,/g, separator)

  return (
    <span
      ref={ref}
      className={cn(
        colorScheme === "gradient"
          ? "bg-gradient-to-r from-[#0096b7] to-[#48cae4] bg-clip-text text-transparent font-bold"
          : "",
        className
      )}
    >
      {prefix}{formatted}{suffix}
    </span>
  )
}

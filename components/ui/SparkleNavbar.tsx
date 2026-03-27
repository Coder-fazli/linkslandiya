"use client"

import { useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'

const BRAND = '#00b4d8'

type NavItem = {
  label: string
  href: string
}

type Props = {
  items: NavItem[]
  className?: string
  linkClassName?: string
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function createSparkle(container: HTMLElement) {
  const sparkle = document.createElement('span')
  sparkle.style.cssText = `
    position: absolute;
    pointer-events: none;
    border-radius: 50%;
    background: ${BRAND};
    box-shadow: 0 0 6px 2px ${BRAND}88;
    transform: translate(-50%, -50%);
  `

  const size = randomBetween(4, 10)
  sparkle.style.width = size + 'px'
  sparkle.style.height = size + 'px'
  sparkle.style.left = randomBetween(10, 90) + '%'
  sparkle.style.top = randomBetween(10, 90) + '%'

  container.appendChild(sparkle)

  gsap.fromTo(sparkle,
    { scale: 0, opacity: 1 },
    {
      scale: randomBetween(1.2, 2),
      opacity: 0,
      duration: randomBetween(0.5, 0.9),
      ease: 'power2.out',
      y: randomBetween(-20, -40),
      x: randomBetween(-15, 15),
      onComplete: () => sparkle.remove(),
    }
  )
}

function spawnSparkles(container: HTMLElement, count = 6) {
  for (let i = 0; i < count; i++) {
    gsap.delayedCall(randomBetween(0, 0.2), () => createSparkle(container))
  }
}

export function SparkleNavLink({ item, linkClassName }: { item: NavItem; linkClassName?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const underlineRef = useRef<HTMLSpanElement>(null)
  const pathname = usePathname()
  const isActive = pathname === item.href

  const handleMouseEnter = useCallback(() => {
    if (containerRef.current) {
      spawnSparkles(containerRef.current)
    }
    if (underlineRef.current) {
      gsap.fromTo(underlineRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.25, ease: 'power2.out' }
      )
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (underlineRef.current && !isActive) {
      gsap.to(underlineRef.current, {
        scaleX: 0, opacity: 0, duration: 0.2, ease: 'power2.in'
      })
    }
  }, [isActive])

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className={linkClassName}
        style={{ position: 'relative', zIndex: 1 }}
      >
        {item.label}
      </Link>
      <span
        ref={underlineRef}
        style={{
          position: 'absolute',
          bottom: -2,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${BRAND}, transparent)`,
          borderRadius: '2px',
          transformOrigin: 'center',
          transform: 'scaleX(0)',
          opacity: isActive ? 1 : 0,
          scaleX: isActive ? 1 : 0,
        } as React.CSSProperties}
      />
    </div>
  )
}

export default function SparkleNavbar({ items, className, linkClassName }: Props) {
  return (
    <nav className={className}>
      {items.map(item => (
        <SparkleNavLink key={item.href} item={item} linkClassName={linkClassName} />
      ))}
    </nav>
  )
}

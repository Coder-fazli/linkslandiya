"use client"
import Link from 'next/link'
import './landing.css'
import { useEffect, useState, useRef } from 'react'
import { ShineButton } from '@/components/ui/ShineButton'
import { TrustedUsers } from '@/components/ui/trusted-users'

const AVATARS = [
  'https://pbs.twimg.com/profile_images/1897311929028255744/otxpL-ke_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1948770261848756224/oPwqXMD6_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg',
  'https://pbs.twimg.com/profile_images/1783856060249595904/8TfcCN0r_400x400.jpg',
]

function Counter({ end, suffix = '' }: { end: number, suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 2000
          const startTime = performance.now()

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * end))

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setCount(end)
            }
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [end])

  return (
    <strong ref={ref} className="counter">
      {count}{suffix}
    </strong>
  )
}

export default function Hero() {
  return (
    <section className="hero-new">
      {/* Background */}
      <div className="hero-bg">
        <div className="hero-shape hero-shape-1"></div>
        <div className="hero-shape hero-shape-2"></div>
      </div>

      <div className="container">
        <div className="hero-grid">
          {/* Left - Content */}
          <div className="hero-left">
            <h1 className="hero-heading animate-fade-up">
              Boost Your SEO With
              <span className="heading-accent"> Premium Backlinks</span>
            </h1>

            <p className="hero-text animate-fade-up delay-1">
              Access 23,000+ high-authority websites for guest posting.
              Manual placement, guaranteed results, one-time payment.
            </p>

            <div className="hero-actions animate-fade-up delay-2">
              <ShineButton
                label="→ Get Started"
                href="/login"
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
              />
               
                
            
              <a href="#features" className="btn-outline">
                Learn More
              </a>
            </div>

            <TrustedUsers
              avatars={AVATARS}
              rating={5}
              totalUsersText={6000}
              caption="❤️ Loved by"
              className="!justify-start !px-0 !py-0 mt-4"
              starColorClass="text-yellow-400"
            />

            <div className="hero-metrics animate-fade-up delay-3">
              <div className="metric">
                <Counter end={23} suffix="K+" />
                <span>Websites</span>
              </div>
              <div className="metric">
                <Counter end={50} suffix="+" />
                <span>Countries</span>
              </div>
              <div className="metric">
                <Counter end={99} suffix="%" />
                <span>Satisfaction</span>
              </div>
            </div>
          </div>

          {/* Right - Animation */}
          <div className="hero-right">
            <div className="hero-image-container">
              <video
                src="/ezgif-722de4b35ef93286.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="hero-video"
              />
              {/* Floating elements */}
              <div className="float-card float-card-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <span>Backlinks</span>
              </div>
              <div className="float-card float-card-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
                <span>+156% Growth</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

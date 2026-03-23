"use client"

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import './FilterShowcase.css'

export default function FilterShowcase() {
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('fs-visible')
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.15 })

    if (imageRef.current)   obs.observe(imageRef.current)
    if (contentRef.current) obs.observe(contentRef.current)

    return () => obs.disconnect()
  }, [])

  return (
    <section className="filter-showcase">
      <div className="filter-showcase-inner">

        {/* LEFT: Image slides in from left */}
        <div className="fs-image-wrap fs-slide-left" ref={imageRef}>
          <Image
            src="/linkslandia-preview.jpg"
            alt="Linkslandia advanced filters"
            width={900}
            height={600}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>

        {/* RIGHT: Content slides in from right */}
        <div className="fs-content fs-slide-right" ref={contentRef}>

          <div className="fs-eyebrow">
            <div className="fs-eyebrow-dot"></div>
            Advanced Filters
          </div>

          <h2 className="fs-title">
            Find your perfect<br />
            <span>guest post</span><br />
            in seconds.
          </h2>

          <p className="fs-desc">
            Browse 500+ vetted websites and narrow down exactly what you need — by niche, domain authority, traffic, country, and price. No guesswork.
          </p>

          <div className="fs-features">
            <div className="fs-feature">
              <div className="fs-feature-icon" style={{ background: '#eff6ff' }}>
                <svg fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
                </svg>
              </div>
              <div>
                <div className="fs-feature-title">Filter by DA, Traffic &amp; Niche</div>
                <div className="fs-feature-sub">Sort by domain authority, monthly traffic, topic, and country to match your SEO goals.</div>
              </div>
            </div>

            <div className="fs-feature">
              <div className="fs-feature-icon" style={{ background: '#f0fdf4' }}>
                <svg fill="none" stroke="#16a34a" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
              <div>
                <div className="fs-feature-title">Smart Search</div>
                <div className="fs-feature-sub">Instantly search websites by name or URL. Results update in real time as you type.</div>
              </div>
            </div>

            <div className="fs-feature">
              <div className="fs-feature-icon" style={{ background: '#fdf4ff' }}>
                <svg fill="none" stroke="#9333ea" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <div className="fs-feature-title">Price Range Control</div>
                <div className="fs-feature-sub">Set your budget and only see websites that fit. No surprises, no hidden fees.</div>
              </div>
            </div>
          </div>

          <Link href="/" className="fs-cta">
            Browse Websites
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>

        </div>
      </div>
    </section>
  )
}

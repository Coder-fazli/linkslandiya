"use client"

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { colors } from "@/app/lib/colors"
import { PulsatingButton } from '@/components/ui/pulsating-button'
import './FilterShowcase.css'

export default function FilterShowcase() {
  const headerRef  = useRef<HTMLDivElement>(null)
  const imageRef   = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('fs-visible')
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.1 })

    if (headerRef.current)   obs.observe(headerRef.current)
    if (imageRef.current)    obs.observe(imageRef.current)
    if (featuresRef.current) obs.observe(featuresRef.current)

    return () => obs.disconnect()
  }, [])

  return (
    <section className="filter-showcase">
      <div className="filter-showcase-inner">

        {/* TOP: Centered heading */}
        <div className="fs-header fs-slide-up" ref={headerRef}>
          <h2 className="fs-title">
            Find your perfect<br />
            <span>guest post</span><br />
            in seconds.
          </h2>

          <p className="fs-desc">
            <strong>Browse 500+ vetted websites</strong> and narrow down exactly what you need —{' '}
            by niche, domain authority, traffic, country, and price. No guesswork.
          </p>
        </div>

        {/* CENTER: Full-width image */}
        <div className="fs-image-outer fs-slide-up" ref={imageRef}>
          <div className="fs-image-wrap">
            <Image
              src="/filter-preview.png"
              alt="Linkslandia advanced filters"
              width={1001}
              height={537}
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          {/* Floating badge */}
          <div className="fs-float-badge">
            <div className="fs-float-badge-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="20" y2="12"/>
                <line x1="12" y1="18" x2="20" y2="18"/>
              </svg>
            </div>
            <div>
              <div className="fs-float-badge-text">Advanced Filters</div>
              <div className="fs-float-badge-sub">DA · Traffic · Niche · Country · Price</div>
            </div>
          </div>
        </div>

        {/* BOTTOM: Features row + CTA */}
        <div className="fs-features-row fs-slide-up" ref={featuresRef}>
          <div className="fs-feature">
            <div className="fs-feature-icon" style={{ background: '#eff6ff' }}>
              <svg fill="none" stroke={colors.primary} strokeWidth="2" viewBox="0 0 24 24">
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

          <div className="fs-cta-wrap">
            <Link href="/websites">
              <PulsatingButton duration="2.2s">
                Browse Websites
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </PulsatingButton>
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}

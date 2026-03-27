"use client"

import { useEffect, useRef } from 'react'
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

        {/* CENTER: Mock table UI */}
        <div className="fs-image-outer fs-slide-up" ref={imageRef}>
          <div className="fs-image-wrap" style={{ padding: 0, overflow: 'hidden', background: '#f4f6f9', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', height: '420px', fontFamily: 'inherit' }}>

              {/* Left: Filters panel */}
              <div style={{ width: '220px', flexShrink: 0, background: '#fff', borderRight: '1px solid #e8edf2', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontWeight: 800, fontSize: '14px', color: '#1e293b' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                  Filters
                </div>
                {[
                  { label: 'SEARCH', el: <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '7px', padding: '7px 10px', fontSize: '12px', color: '#94a3b8' }}>Search website…</div> },
                  { label: 'PRICE ($)', el: <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}><div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '7px', padding: '6px 8px', fontSize: '12px', color: '#94a3b8' }}>Min</div><span style={{ color: '#94a3b8', fontSize: '11px' }}>-</span><div style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '7px', padding: '6px 8px', fontSize: '12px', color: '#94a3b8' }}>Max</div></div> },
                  { label: 'MIN TRAFFIC', el: <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '7px', padding: '7px 10px', fontSize: '12px', color: '#94a3b8' }}>e.g. 10000</div> },
                  { label: 'DA (MOZ)', el: <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '7px', padding: '7px 10px', fontSize: '12px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ background: colors.primary, color: '#fff', fontWeight: 800, fontSize: '9px', padding: '1px 5px', borderRadius: '3px' }}>MOZ</span>All DA</span><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></div> },
                  { label: 'DR (AHREFS)', el: <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '7px', padding: '7px 10px', fontSize: '12px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><span style={{ background: '#ff6b35', color: '#fff', fontWeight: 800, fontSize: '9px', padding: '1px 5px', borderRadius: '3px' }}>AHR</span>All DR</span><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></div> },
                  { label: 'COUNTRY', el: <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '7px', padding: '7px 10px', fontSize: '12px', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>All Countries<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></div> },
                ].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: '6px' }}>{f.label}</div>
                    {f.el}
                  </div>
                ))}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ textAlign: 'center', fontSize: '12px', color: colors.primary, fontWeight: 600 }}>↺ Reset All</div>
                  <div style={{ background: colors.primary, color: '#fff', borderRadius: '8px', padding: '10px', textAlign: 'center', fontWeight: 700, fontSize: '13px' }}>527 sites found</div>
                </div>
              </div>

              {/* Right: Table */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.7fr 0.7fr 0.75fr 0.8fr 0.75fr 0.8fr', gap: '8px', padding: '10px 16px', background: '#fff', borderBottom: '1px solid #e8edf2', position: 'sticky', top: 0, zIndex: 1 }}>
                  {['WEBSITE', 'DA', 'DR', 'TRAFFIC', 'TOPIC', 'PRICING', 'ACTION'].map((h, i) => (
                    <div key={h} style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textAlign: i > 0 ? 'center' : 'left' }}>
                      {h === 'DA' ? <span style={{ color: colors.primary, fontWeight: 900 }}>MOZ DA</span> :
                       h === 'DR' ? <span style={{ color: '#ff6b35', fontWeight: 900 }}>ahrefs DR</span> : h}
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {[
                  { name: 'TechCrunch', domain: '.com', da: 92, dr: 88, traffic: '12M', topic: 'Technology', price: '$450', badge: { text: '🔥 Trending', bg: '#ff6b35' }, barColor: '#22c55e' },
                  { name: 'Forbes', domain: '.com', da: 95, dr: 91, traffic: '25M', topic: 'Business', price: '$600', badge: { text: '⭐ Featured', bg: '#f59e0b' }, barColor: '#22c55e' },
                  { name: 'BusinessInsider', domain: '.com', da: 93, dr: 89, traffic: '10M', topic: 'Finance', price: '$400', badge: null, barColor: '#22c55e' },
                  { name: 'Entrepreneur', domain: '.com', da: 91, dr: 86, traffic: '8M', topic: 'Startups', price: '$350', badge: { text: '📈 High ROI', bg: '#8b5cf6' }, barColor: '#f59e0b' },
                  { name: 'CoinDesk', domain: '.com', da: 88, dr: 82, traffic: '5M', topic: 'Crypto', price: '$320', badge: null, barColor: '#f59e0b' },
                  { name: 'HuffPost', domain: '.com', da: 87, dr: 79, traffic: '4M', topic: 'News', price: '$250', badge: null, barColor: '#f59e0b' },
                  { name: 'Mashable', domain: '.com', da: 85, dr: 76, traffic: '3M', topic: 'Technology', price: '$200', badge: null, barColor: '#ef4444' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.8fr 0.7fr 0.7fr 0.75fr 0.8fr 0.75fr 0.8fr', gap: '8px', padding: '12px 16px', background: i % 2 === 0 ? '#fff' : '#fafbfc', borderBottom: '1px solid #f0f4f8', alignItems: 'center' }}>
                    {/* Website */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '6px', background: `hsl(${i * 47}, 65%, 92%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: `hsl(${i * 47}, 55%, 35%)`, flexShrink: 0 }}>{row.name[0]}</div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}><strong>{row.name}</strong>{row.domain}</div>
                        {row.badge && <span style={{ background: row.badge.bg, color: '#fff', fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '999px' }}>{row.badge.text}</span>}
                      </div>
                    </div>
                    {/* DA */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{row.da}</div>
                      <div style={{ height: '3px', background: '#e8edf2', borderRadius: '2px', marginTop: '3px' }}><div style={{ height: '100%', width: `${row.da}%`, background: row.barColor, borderRadius: '2px' }} /></div>
                    </div>
                    {/* DR */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{row.dr}</div>
                      <div style={{ height: '3px', background: '#e8edf2', borderRadius: '2px', marginTop: '3px' }}><div style={{ height: '100%', width: `${row.dr}%`, background: '#f97316', borderRadius: '2px' }} /></div>
                    </div>
                    {/* Traffic */}
                    <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{row.traffic} ↗</div>
                    {/* Topic */}
                    <div style={{ textAlign: 'center' }}><span style={{ background: '#f1f5f9', color: '#475569', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '999px', border: '1px solid #e2e8f0' }}>{row.topic}</span></div>
                    {/* Price */}
                    <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{row.price}</div>
                    {/* Action */}
                    <div style={{ textAlign: 'center' }}><span style={{ background: colors.primary, color: '#fff', fontSize: '11px', fontWeight: 700, padding: '5px 14px', borderRadius: '999px', display: 'inline-block' }}>Post</span></div>
                  </div>
                ))}
              </div>
            </div>
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

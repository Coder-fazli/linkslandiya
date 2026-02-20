"use client"

import { useEffect, useRef } from 'react'
import './Features.css'
import Link from 'next/link'

const features = [
  {
    id: 1,
    title: "Manual Placement",
    description: "Every article is carefully placed by our team. No automation, no bots - just quality human work.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    size: "large",
    highlight: true
  },
  {
    id: 2,
    title: "100% Guarantee",
    description: "Full money-back guarantee within 7 days if we can't deliver.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    size: "medium"
  },
  {
    id: 3,
    title: "23K+ Websites",
    description: "Access our massive network",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="21" x2="9" y2="9"/>
      </svg>
    ),
    size: "small",
    stat: "23,250+"
  },
  {
    id: 4,
    title: "One-Time Payment",
    description: "Pay once, stay forever. Your content remains live for the entire platform lifetime.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <circle cx="12" cy="12" r="3"/>
        <path d="M2 10h2"/>
        <path d="M20 10h2"/>
      </svg>
    ),
    size: "medium"
  },
  {
    id: 5,
    title: "Content Writing",
    description: "Need articles? Our professional copywriters create SEO-optimized content tailored to your niche.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    size: "large"
  },
  {
    id: 6,
    title: "Proven Results",
    description: "Boost rankings across all search engines",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    size: "small",
    stat: "+156%"
  }
]

export default function Features() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="features-section">

      <div className="container">
        <div className="features-header">
          <span className="features-label">Why Choose Us</span>
          <h2 className="features-heading">Everything You Need for SEO Success</h2>
          <p className="features-desc">
            Premium guest posting services with guaranteed results and complete transparency
          </p>
        </div>

        <div className="bento-wrapper">
          <div className="bento-bg-shape"></div>
          <div className="bento-grid">
            {features.map((feature, index) => (
            <div
              key={feature.id}
              ref={(el) => { cardsRef.current[index] = el }}
              className={`bento-card bento-${feature.size} ${feature.highlight ? 'bento-highlight' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bento-card-inner">
                <div className="bento-icon">
                  {feature.icon}
                </div>
                <div className="bento-content">
                  <h3 className="bento-title">{feature.title}</h3>
                  {feature.stat && (
                    <span className="bento-stat">{feature.stat}</span>
                  )}
                  <p className="bento-description">{feature.description}</p>
                </div>
                <div className="bento-shine"></div>
              </div>
            </div>
            ))}
          </div>
        </div>

    <Link
     href = '/login'
    className="features-cta"
    target="_blank"
    rel="noopener noreferrer"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
      Get Started Free
    
    </Link>
      </div>
    </section>
  )
}

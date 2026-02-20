"use client"

import { useEffect, useRef } from 'react'
import './GlobalReach.css'

const countries = [
  {
    id: 1,
    name: "United States",
    region: "North America",
    flagUrl: "https://flagcdn.com/w80/us.png",
    sites: "2.5K+",
    growth: "+12%",
    position: "left-top"
  },
  {
    id: 2,
    name: "United Kingdom",
    region: "Europe",
    flagUrl: "https://flagcdn.com/w80/gb.png",
    sites: "1.8K+",
    growth: "+8%",
    position: "center-top"
  },
  {
    id: 3,
    name: "Germany",
    region: "Europe",
    flagUrl: "https://flagcdn.com/w80/de.png",
    sites: "1.2K+",
    growth: "+15%",
    position: "right-top"
  },
  {
    id: 4,
    name: "UAE",
    region: "Middle East",
    flagUrl: "https://flagcdn.com/w80/ae.png",
    sites: "800+",
    growth: "+22%",
    position: "center-middle"
  },
  {
    id: 5,
    name: "India",
    region: "Asia",
    flagUrl: "https://flagcdn.com/w80/in.png",
    sites: "1.5K+",
    growth: "+18%",
    position: "right-middle"
  },
  {
    id: 6,
    name: "Australia",
    region: "Oceania",
    flagUrl: "https://flagcdn.com/w80/au.png",
    sites: "600+",
    growth: "+10%",
    position: "right-bottom"
  },
  {
    id: 7,
    name: "Brazil",
    region: "South America",
    flagUrl: "https://flagcdn.com/w80/br.png",
    sites: "900+",
    growth: "+25%",
    position: "left-bottom"
  }
]

export default function GlobalReach() {
  const sectionRef = useRef<HTMLElement>(null)
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
    <section className="global-reach" ref={sectionRef}>
      <div className="global-reach-bg">
        <div className="world-map-container">
          {/* Using a proper world map image */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg"
            alt="World Map"
            className="world-map-image"
          />
          {/* Connection dots overlay */}
          <div className="map-dots-overlay">
            <span className="map-dot-pulse" style={{ left: '18%', top: '35%' }}></span>
            <span className="map-dot-pulse" style={{ left: '48%', top: '30%' }}></span>
            <span className="map-dot-pulse" style={{ left: '55%', top: '35%' }}></span>
            <span className="map-dot-pulse" style={{ left: '58%', top: '55%' }}></span>
            <span className="map-dot-pulse" style={{ left: '72%', top: '42%' }}></span>
            <span className="map-dot-pulse" style={{ left: '82%', top: '75%' }}></span>
            <span className="map-dot-pulse" style={{ left: '28%', top: '65%' }}></span>
          </div>
        </div>
        <div className="global-gradient-overlay"></div>
      </div>

      <div className="container">
        <div className="global-reach-header">
          <span className="global-reach-badge">Global Network</span>
          <h2 className="global-reach-title">Reach Audiences Worldwide</h2>
          <p className="global-reach-subtitle">
            Access premium guest post opportunities across 50+ countries with our rapidly growing international network
          </p>
        </div>

        <div className="country-cards-wrapper">
          {countries.map((country, index) => (
            <div
              key={country.id}
              ref={(el) => { cardsRef.current[index] = el }}
              className={`country-card country-card-${country.position}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="country-card-flag">
                <img
                  src={country.flagUrl}
                  alt={`${country.name} flag`}
                  width={40}
                  height={28}
                />
              </div>
              <div className="country-card-info">
                <h4 className="country-card-name">{country.name}</h4>
                <span className="country-card-region">{country.region}</span>
              </div>
              <div className="country-card-stats">
                <span className="country-card-sites">{country.sites}</span>
                <span className="country-card-growth">{country.growth}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="global-stats">
          <div className="global-stat">
            <span className="global-stat-value">50+</span>
            <span className="global-stat-label">Countries</span>
          </div>
          <div className="global-stat">
            <span className="global-stat-value">23K+</span>
            <span className="global-stat-label">Websites</span>
          </div>
          <div className="global-stat">
            <span className="global-stat-value">15+</span>
            <span className="global-stat-label">Languages</span>
          </div>
          <div className="global-stat">
            <span className="global-stat-value">99%</span>
            <span className="global-stat-label">Satisfaction</span>
          </div>
        </div>
      </div>
    </section>
  )
}

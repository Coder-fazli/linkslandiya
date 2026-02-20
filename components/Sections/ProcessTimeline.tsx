"use client"

import { useEffect, useRef } from 'react'
import './ProcessTimeline.css'

const steps = [
    {
        number: "01",
        title: "Browse & Filter",
        description: "Search sites by niche, DA, and price",
    },
    {
        number: "02",
        title: "Select & Order",
        description: "Add to cart and checkout",
    },
    {
        number: "03",
        title: "We Publish",
        description: "We create and publish content",
    },
    {
        number: "04",
        title: "Track Results",
        description: "Monitor your backlinks",
    }
]

export default function ProcessTimeline() {
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in')
                }
            },
            { threshold: 0.3 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <section className="process-simple" ref={sectionRef}>
            <div className="container">
                <div className="process-header">
                    <span className="process-label">How It Works</span>
                    <h2 className="process-title">
                        Simple <span>4-Step</span> Process
                    </h2>
                </div>

                <div className="steps-row">
                    {steps.map((step, index) => (
                        <div key={step.number} className="step-item" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="step-num">{step.number}</div>
                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-desc">{step.description}</p>
                            {index < steps.length - 1 && <div className="step-arrow">→</div>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

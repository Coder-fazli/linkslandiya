"use client"

import { useState } from "react"
import "./BlogSlider.css"

const posts = [
    {
        title: "How to Build High-Quality Backlinks in 2025",
        excerpt: "Learn the proven strategies for acquiring backlinks that actually move the needle for your SEO rankings.",
        gradient: "linear-gradient(135deg, #1B7FFF 0%, #60AEFF 100%)",
    },
    {
        title: "Guest Posting Guide: What Works Today",
        excerpt: "Everything you need to know about guest posting — from finding sites to writing content that gets accepted.",
        gradient: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
    },
    {
        title: "DA vs DR: Which Metric Actually Matters?",
        excerpt: "Domain Authority and Domain Rating explained — and which one you should focus on when buying backlinks.",
        gradient: "linear-gradient(135deg, #1565C0 0%, #1B7FFF 100%)",
    },
    {
        title: "How to Choose the Right Website for Your Niche",
        excerpt: "Not all websites are equal. Learn how to filter and select the best sites for maximum SEO impact.",
        gradient: "linear-gradient(135deg, #312e81 0%, #4f46e5 100%)",
    },
    {
        title: "The Truth About Link Velocity",
        excerpt: "Building links too fast can hurt you. Discover the safe pace for growing your backlink profile naturally.",
        gradient: "linear-gradient(135deg, #1e3a5f 0%, #60AEFF 100%)",
    },
]

export default function BlogSlider() {
    const [current, setCurrent] = useState(0)
    const visible = 3
    const max = posts.length - visible

    function prev() {
        setCurrent(c => Math.max(0, c - 1))
    }

    function next() {
        setCurrent(c => Math.min(max, c + 1))
    }

    return (
        <section className="blog-slider-section">
            <div className="blog-slider-container">
                <div className="blog-slider-header">
                    <div className="blog-slider-header-left">
                        <span className="blog-slider-tag">Latest Insights</span>
                        <h2 className="blog-slider-title">Get updates and insights from our expert team!</h2>
                        <p className="blog-slider-desc">
                            Discover tips, best practices, and the latest trends in SEO and link building.
                            Unlock your potential with expert guidance and technical insights to enhance
                            your projects. Stay ahead of the curve by exploring innovative solutions and
                            community-driven resources.
                        </p>
                    </div>
                    <div className="blog-slider-arrows">
                        <button className="blog-arrow" onClick={prev} disabled={current === 0}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 5l-7 7 7 7" />
                            </svg>
                        </button>
                        <button className="blog-arrow" onClick={next} disabled={current === max}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="blog-slider-track-wrapper">
                    <div
                        className="blog-slider-track"
                        style={{ transform: `translateX(calc(-${current} * (100% / ${visible} + 1.25rem / ${visible} * (${visible} - 1))))` }}
                    >
                        {posts.map((post, i) => (
                            <div className="blog-card" key={i}>
                                <div className="blog-card-image">
                                    <div className="blog-card-image-bg" style={{ background: post.gradient }} />
                                    <button className="blog-card-arrow">
                                        <span className="blog-card-arrow-inner">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M7 17L17 7M7 7h10v10" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                                <h3 className="blog-card-title">{post.title}</h3>
                                <p className="blog-card-excerpt">{post.excerpt}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

"use client"

import { motion } from "motion/react"
import Link from "next/link"
import "../ui/landing.css"
import "./Packages.css"
import type { Package } from "@/models/package"

type Props = {
    packages: Package[]
    isLoggedIn: boolean
}

export default function Packages({ packages, isLoggedIn }: Props) {
    return (
        <section className="packages-section">
            <div className="packages-bg">
                <div className="packages-blob packages-blob-1"></div>
                <div className="packages-blob packages-blob-2"></div>
            </div>

            <div className="container">
                <span className="section-label">Packages</span>
                <h1 className="section-heading">Link Building Packages</h1>
                <p className="section-desc">
                    Done-for-you guest posting and link building, matched to how much authority you need to build each month.
                </p>

                <div className="packages-grid">
                    {packages.map((pkg, index) => {
                        const ctaHref = isLoggedIn
                            ? `/admin/packages/request?packageId=${pkg._id}`
                            : `/login`
                        return (
                            <motion.div
                                key={pkg._id?.toString() ?? pkg.name}
                                className={`package-card ${pkg.popular ? "popular" : ""}`}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {pkg.popular && <span className="package-popular-badge">Most Popular</span>}

                                <h3 className="package-name">{pkg.name}</h3>
                                <p className="package-desc">{pkg.description}</p>

                                <div className="package-price">
                                    <span className="package-price-amount">${pkg.price}</span>
                                    <span className="package-price-period">/ month</span>
                                </div>

                                {pkg.features.length > 0 && (
                                    <ul className="package-features">
                                        {pkg.features.map(f => (
                                            <li key={f}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <Link href={ctaHref} className={`btn ${pkg.popular ? "btn-primary" : "btn-secondary"} package-cta`}>
                                    {pkg.buttonText}
                                </Link>

                                {pkg.includes.length > 1 && (
                                    <div className="package-includes">
                                        <div className="package-includes-title">{pkg.includes[0]}</div>
                                        <ul>
                                            {pkg.includes.slice(1).map(item => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>

                <p className="packages-footnote">
                    Need something custom? <Link href="/contact">Contact us</Link> and we&apos;ll put together a plan for you.
                </p>
            </div>
        </section>
    )
}

"use client"
import Link from "next/link"

const quickLinks = [
    {
        title: "About Us",
        links: [
            { label: "How It Works", href: "/#how-it-works" },
            { label: "Browse Websites", href: "/websites" },
            { label: "Packages", href: "/#packages" },
            { label: "Blog", href: "/blog" },
        ],
    },
    {
        title: "Services",
        links: [
            { label: "Guest Posting", href: "/websites" },
            { label: "Link Building", href: "/websites" },
            { label: "Content Writing", href: "/websites" },
            { label: "SEO Consulting", href: "/contact" },
        ],
    },
    {
        title: "Support",
        links: [
            { label: "Help Center", href: "/contact" },
            { label: "Contact Us", href: "/contact" },
            { label: "FAQ", href: "/#faq" },
            { label: "Community", href: "#" },
        ],
    },
]

const socialLinks = [
    {
        label: "Facebook",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    },
    {
        label: "Twitter",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
    {
        label: "Instagram",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
        ),
    },
    {
        label: "LinkedIn",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        label: "GitHub",
        href: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
        ),
    },
]

export default function Footer() {
    return (
        <footer style={{ background: "#0d1117", color: "#9ca3af" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 1.5rem 0" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "2.5rem", paddingBottom: "4rem" }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                            <div style={{ width: "32px", height: "32px", background: "#1B7FFF", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18">
                                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                                </svg>
                            </div>
                            <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "1.1rem" }}>Linkslandia</span>
                        </div>
                        <p style={{ fontSize: "0.875rem", lineHeight: "1.7", color: "#6b7280" }}>
                            Empowering SEO growth through premium guest posts and high-quality backlinks from vetted publishers.
                        </p>
                    </div>

                    {/* Link columns */}
                    {quickLinks.map((section) => (
                        <div key={section.title}>
                            <h3 style={{ color: "#ffffff", fontWeight: 600, fontSize: "0.95rem", marginBottom: "1.25rem" }}>
                                {section.title}
                            </h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} style={{ color: "#6b7280", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}
                                            onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                                            onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div style={{ borderTop: "1px solid #1f2937", padding: "1.75rem 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "1.25rem" }}>
                        {socialLinks.map((s) => (
                            <a key={s.label} href={s.href} aria-label={s.label}
                                style={{ color: "#4b5563", textDecoration: "none", transition: "color 0.2s" }}
                                onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                                onMouseLeave={e => (e.currentTarget.style.color = "#4b5563")}
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                    <div style={{ textAlign: "right", fontSize: "0.875rem", color: "#4b5563" }}>
                        <p>© {new Date().getFullYear()} Linkslandia. All rights reserved.</p>
                        <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem", justifyContent: "flex-end" }}>
                            <Link href="/privacy" style={{ color: "#4b5563", textDecoration: "none" }}>Privacy Policy</Link>
                            <Link href="/terms" style={{ color: "#4b5563", textDecoration: "none" }}>Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

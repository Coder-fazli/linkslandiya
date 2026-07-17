"use client"

import { useState, useTransition } from "react"
import { submitContactAction } from "@/app/lib/contact-actions"
import "../ui/landing.css"
import "./Contact.css"

const SUBJECTS = [
    "General Question",
    "Guest Posting & Link Building",
    "Packages & Pricing",
    "Publisher Partnership",
    "Payment & Billing",
    "Technical Issue",
]

export default function Contact() {
    const [pending, startTransition] = useTransition()
    const [sent, setSent] = useState(false)
    const [error, setError] = useState("")

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError("")
        const formData = new FormData(e.currentTarget)
        startTransition(async () => {
            const result = await submitContactAction(formData)
            if (result?.error) {
                setError(result.error)
                return
            }
            setSent(true)
        })
    }

    return (
        <section className="contact-section">
            <div className="contact-bg">
                <div className="contact-blob contact-blob-1"></div>
                <div className="contact-blob contact-blob-2"></div>
            </div>

            <div className="container">
                <span className="section-label">Contact Us</span>
                <h1 className="section-heading">We&apos;d Love to Hear From You</h1>
                <p className="section-desc">
                    Questions about guest posting, packages, or partnerships? Our team replies within 24 hours.
                </p>

                <div className="contact-grid">
                    {/* Left — contact channels */}
                    <div className="contact-info">
                        <div className="contact-card">
                            <div className="contact-card-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </div>
                            <div>
                                <h3 className="contact-card-title">Email Us</h3>
                                <p className="contact-card-text">We answer every message within one business day.</p>
                                <a href="mailto:support@linkslandiya.com" className="contact-card-link">
                                    support@linkslandiya.com
                                </a>
                            </div>
                        </div>

                        <div className="contact-card">
                            <div className="contact-card-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                            <div>
                                <h3 className="contact-card-title">Support Hours</h3>
                                <p className="contact-card-text">
                                    Monday – Friday, 9:00 – 18:00 (CET).<br />
                                    We reply to every message within 24 hours.
                                </p>
                            </div>
                        </div>

                        <div className="contact-note">
                            <strong>Existing customer?</strong> You can also message us from your dashboard — orders,
                            revisions and payments are handled fastest there.
                        </div>
                    </div>

                    {/* Right — form */}
                    <div className="contact-form-card">
                        {sent ? (
                            <div className="contact-success">
                                <div className="contact-success-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <h3>Message sent!</h3>
                                <p>Thanks for reaching out — we&apos;ll get back to you within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form">
                                {/* Honeypot — hidden from humans */}
                                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="contact-honeypot" aria-hidden="true" />

                                <div className="contact-form-row">
                                    <div className="contact-field">
                                        <label htmlFor="contact-name">Your Name</label>
                                        <input id="contact-name" name="name" type="text" placeholder="John Smith" required maxLength={100} />
                                    </div>
                                    <div className="contact-field">
                                        <label htmlFor="contact-email">Email Address</label>
                                        <input id="contact-email" name="email" type="email" placeholder="john@company.com" required maxLength={200} />
                                    </div>
                                </div>

                                <div className="contact-field">
                                    <label htmlFor="contact-subject">Subject</label>
                                    <select id="contact-subject" name="subject" required defaultValue="">
                                        <option value="" disabled>Choose a topic…</option>
                                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div className="contact-field">
                                    <label htmlFor="contact-message">Message</label>
                                    <textarea id="contact-message" name="message" rows={6} placeholder="Tell us how we can help…" required minLength={10} maxLength={5000} />
                                </div>

                                {error && <p className="contact-error">{error}</p>}

                                <button type="submit" className="contact-submit" disabled={pending}>
                                    {pending ? "Sending…" : "Send Message"}
                                </button>

                                <p className="contact-privacy">
                                    We only use your details to reply to your message — no spam, ever.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

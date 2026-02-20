"use client"
import { useState } from 'react'
import '../ui/landing.css'

const faqData = [
    {
        question: "Is link insertion an effective strategy?",
        answer: "Yes, link insertion is a highly effective SEO strategy when done correctly. It involves placing your links within existing, relevant content on authoritative websites, which can significantly boost your search engine rankings and drive targeted traffic to your site."
    },
    {
        question: "How to find suitable sites for link insertion?",
        answer: "Finding suitable sites involves analyzing domain authority, relevance to your niche, traffic metrics, and content quality. Our platform provides access to over 23,000 pre-vetted websites across various industries, making the selection process seamless."
    },
    {
        question: "How long do I have to accept an order?",
        answer: "Orders typically need to be accepted within 48-72 hours. However, the exact timeframe may vary depending on the specific service and website requirements. You'll receive notifications about pending orders through your dashboard."
    },
    {
        question: "Is the panel supported by all browsers?",
        answer: "Yes, our platform is fully compatible with all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. We recommend using the latest browser versions for the best experience and security."
    },
    {
        question: "I still have some questions. Who can provide answers to them?",
        answer: "Our support team is available 24/7 to assist you. You can reach us through the live chat on our platform, email us at support@linkslandiya.com, or schedule a call with one of our SEO specialists for personalized guidance."
    },
    {
        question: "Is niche edits backlink better than guest post backlinks?",
        answer: "Both strategies have their merits. Niche edits (link insertions) place links in existing, indexed content which can provide faster results. Guest posts offer more control over content and anchor text. The best approach often combines both strategies based on your specific SEO goals."
    }
]

export default function Faq() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className="faq" id="faq">
            {/* Background elements */}
            <div className="faq-bg">
                <div className="faq-blob faq-blob-1"></div>
                <div className="faq-blob faq-blob-2"></div>
                <span className="faq-dot faq-dot-1"></span>
                <span className="faq-dot faq-dot-2"></span>
                <span className="faq-dot faq-dot-3"></span>
                <span className="faq-dot faq-dot-4"></span>
            </div>
            <div className="container">
                <h2 className="faq-title">FAQ</h2>

                <div className="faq-list">
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openIndex === index ? 'open' : ''}`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => toggleItem(index)}
                                aria-expanded={openIndex === index}
                            >
                                <span>{item.question}</span>
                                <svg
                                    className="faq-chevron"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <polyline points="9 18 15 12 9 6"/>
                                </svg>
                            </button>
                            <div className="faq-answer">
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

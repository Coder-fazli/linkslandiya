"use client"

import './Services.css'

const services = [
    {
        id: 1,
        title: "Link Building",
        description: "Customized Link Building Services, Unified in One Dashboard.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
        ),
        stats: "2.5K+ Links Built"
    },
    {
        id: 2,
        title: "Niche Link Building",
        description: "High-Quality, Targeted Backlinks for different niches",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9 12l2 2 4-4"/>
            </svg>
        ),
        featured: true,
        stats: "500+ Niches"
    },
    {
        id: 3,
        title: "Digital PR Services",
        description: "Amplifying Your Brand's Voice with Strategic Media Outreach",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
        ),
        stats: "150+ Media Sites"
    }
]

export default function Services() {
    return (
        <section className="services-new" id="services">
            <div className="services-new-bg">
                <div className="services-gradient-orb services-orb-1"></div>
                <div className="services-gradient-orb services-orb-2"></div>
            </div>

            <div className="container">
                <div className="services-new-header">
                    <span className="services-new-badge">Our Services</span>
                    <h2 className="services-new-title">Rank Ahead of Others in SERPs</h2>
                    <p className="services-new-subtitle">
                        Grow websites & brands with our SEO and link building services
                    </p>
                </div>

                <div className="services-new-grid">
                    {services.map((service) => (
                        <article
                            key={service.id}
                            className={`service-card-new ${service.featured ? 'service-card-featured' : ''}`}
                        >
                            {service.featured && <span className="service-badge">Popular</span>}

                            <div className="service-icon-new">
                                {service.icon}
                            </div>

                            <h3 className="service-title-new">{service.title}</h3>
                            <p className="service-desc-new">{service.description}</p>

                            <div className="service-footer">
                                <span className="service-stat">{service.stats}</span>
                                <a href="#" className="service-link">
                                    Learn More
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
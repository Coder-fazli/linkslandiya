import { ObjectId } from "mongodb"

// A pricing package shown on /packages — fully admin-editable content
export type Package = {
    _id?: string | ObjectId
    name: string
    description: string
    price: number
    buttonText: string
    popular?: boolean
    features: string[]   // short highlights at the top of the card
    includes: string[]   // "What's included" checklist
    active: boolean       // visible on the public page or not
    order: number          // display order, lower first
    createdAt: Date
    updatedAt?: Date
}

// Shown on /packages only when no real packages exist yet in the database —
// relevant to Linkslandia (link building), not generic SaaS placeholder copy
export const DEMO_PACKAGES: Package[] = [
    {
        _id: "demo-starter",
        name: "Starter",
        description: "For small sites getting their first authority backlinks",
        price: 299,
        buttonText: "Get Started",
        features: ["5 guest posts / month", "DA 20–40 websites", "Manual outreach & vetting"],
        includes: [
            "What's included:",
            "Niche-relevant placements",
            "Dofollow links",
            "Basic performance report",
        ],
        active: true,
        order: 0,
        createdAt: new Date(0),
    },
    {
        _id: "demo-growth",
        name: "Growth",
        description: "For businesses scaling their link building month over month",
        price: 799,
        buttonText: "Get Started",
        popular: true,
        features: ["15 guest posts / month", "DA 30–60 websites", "Priority publisher matching"],
        includes: [
            "Everything in Starter, plus:",
            "Dedicated account manager",
            "Content written for you",
            "Monthly strategy call",
        ],
        active: true,
        order: 1,
        createdAt: new Date(0),
    },
    {
        _id: "demo-agency",
        name: "Agency",
        description: "For agencies and large teams managing multiple client campaigns",
        price: 1999,
        buttonText: "Talk to Sales",
        features: ["50+ guest posts / month", "DA 40+ premium websites", "White-label reporting"],
        includes: [
            "Everything in Growth, plus:",
            "Multi-client project management",
            "Custom SLAs",
            "API access",
        ],
        active: true,
        order: 2,
        createdAt: new Date(0),
    },
]

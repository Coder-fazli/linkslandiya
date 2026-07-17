import type { Metadata } from "next"
import Contact from "@/components/Sections/Contact"

export const metadata: Metadata = {
    title: "Contact Us — Linkslandia",
    description: "Get in touch with the Linkslandia team — questions about guest posting, packages, publisher partnerships or billing. We reply within 24 hours.",
}

export default function ContactPage() {
    return (
        <main className="main">
            <Contact />
        </main>
    )
}

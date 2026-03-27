import { cn } from "@/lib/utils"

const testimonials = [
  {
    name: "Sarah Mitchell",
    title: "SEO Manager, GrowthLab",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    body: "We went from page 4 to page 1 in under 3 months. The quality of sites on Linkslandia is unmatched — every backlink actually moved the needle.",
  },
  {
    name: "James Kowalski",
    title: "Founder, RankFast Agency",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    body: "I've tried 6 different link building platforms. Linkslandia is the only one where the DA scores are real and the placements are permanent.",
  },
  {
    name: "Priya Nair",
    title: "Content Strategist, ScaleUp",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    body: "The filtering system is a game changer. I found 12 niche-relevant sites in under 10 minutes. My clients are seeing results within weeks.",
  },
  {
    name: "Daniel Reyes",
    title: "Digital Marketing Lead, NovaBrands",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    body: "Transparent pricing, real traffic numbers, and fast delivery. Our organic traffic jumped 180% in Q1 using Linkslandia exclusively.",
  },
  {
    name: "Anika Hoffmann",
    title: "E-commerce SEO, ShopBoost",
    image: "https://randomuser.me/api/portraits/women/26.jpg",
    body: "Finally a marketplace that vets every site. No PBNs, no spam — just clean, high-authority links that Google loves.",
  },
  {
    name: "Tom Nguyen",
    title: "Independent SEO Consultant",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    body: "I recommend Linkslandia to every client. The ROI is incredible — one guest post from a DA 70+ site tripled our local rankings.",
  },
]

function TestimonialCard({ item }: { item: (typeof testimonials)[number] }) {
  return (
    <div style={{
      width: '320px',
      minHeight: '140px',
      padding: '20px',
      background: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}>
      <p style={{
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#6b7280',
        margin: '0 0 16px 0',
      }}>
        {item.body}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>
            {item.name}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
            {item.title}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Marquee({
  children,
  direction = "left",
  repeat = 4,
  duration = 60,
  className,
  ...props
}: {
  children: React.ReactNode
  direction?: "left" | "right"
  repeat?: number
  duration?: number
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "group flex [gap:var(--gap)] overflow-hidden [--gap:1rem]",
        className
      )}
      style={{ "--duration": `${duration}s` } as React.CSSProperties}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee-left": direction === "left",
              "animate-marquee-right": direction === "right",
              "group-hover:[animation-play-state:paused]": true,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  )
}

export function MarqueeDemo() {
  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden', padding: '20px 0' }}>
      {/* Left fade */}
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '80px',
        background: 'linear-gradient(to right, #f8fafc, transparent)',
        zIndex: 10,
        pointerEvents: 'none',
      }} />
      {/* Right fade */}
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: '80px',
        background: 'linear-gradient(to left, #f8fafc, transparent)',
        zIndex: 10,
        pointerEvents: 'none',
      }} />
      <Marquee className="py-4" direction="left">
        {[...testimonials, ...testimonials].map((item, index) => (
          <TestimonialCard key={index} item={item} />
        ))}
      </Marquee>
      <div style={{ height: '20px' }} />
      <Marquee className="py-4" direction="right">
        {[...testimonials, ...testimonials].map((item, index) => (
          <TestimonialCard key={index} item={item} />
        ))}
      </Marquee>
    </div>
  )
}

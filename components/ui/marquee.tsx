import { cn } from "@/lib/utils"

const testimonials = [
  {
    name: "Emma Wilson",
    title: "Product Designer, TechCorp",
    image: "https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-2.webp",
    body: "This design system has transformed our workflow. The components are intuitive and well-documented.",
  },
  {
    name: "Lucas Chen",
    title: "Frontend Developer, WebFlow",
    image: "https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-1.webp",
    body: "The components are well-structured and customizable. They've significantly reduced our development time.",
  },
  {
    name: "Sophia Martinez",
    title: "UI/UX Lead, DesignHub",
    image: "https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-5.webp",
    body: "Every component feels polished and professional. It's become our go-to resource for all projects.",
  },
  {
    name: "Oliver Thompson",
    title: "Creative Director, StudioX",
    image: "https://cdn.badtz-ui.com/images/components/avatar-proof/avatar-4.webp",
    body: "This design system brings consistency and efficiency to our creative process. Beautiful and functional.",
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

/**
 * Brand color tokens — edit here to retheme the whole site.
 * CSS files use var(--brand-primary) etc. from _variables.scss.
 * TSX inline styles import from here.
 */
export const colors = {
  primary:       "#00b4d8",   // bold accent — buttons, links, active states
  primaryLight:  "#90e0ef",   // soft accent — hover fills, light badges
  primaryDark:   "#0096b7",   // hover/pressed state
  primaryMid:    "#48cae4",   // mid tone — some buttons
  primaryBg:     "#f0f9fb",   // very light tint backgrounds
  primaryBorder: "#caf0f8",   // light borders
  primaryShadow: "rgba(0, 180, 216, 0.35)", // box-shadow glow
} as const

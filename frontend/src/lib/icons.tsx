'use client'

/* eslint-disable react/display-name */

import * as React from 'react'

/**
 * Lightweight, dependency-free icon library.
 *
 * Drop-in replacement for the subset of `lucide-react` icons used across
 * the app. Each export is a self-contained component backed by an inline SVG,
 * so you can open this single file to read, tweak, or add new icons.
 *
 * Style: 24x24 viewBox, 2px stroke, round caps/joins.
 */

export type Icon = React.ComponentType<React.SVGProps<SVGSVGElement>>
export type LucideIcon = Icon // kept for compatibility with existing imports

type Props = React.SVGProps<SVGSVGElement>

/* Base SVG shell shared by every icon. */
function Base({ children, ...props }: { children: React.ReactNode } & Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
}

/* Helper: build a component from raw path nodes. */
function make(paths: React.ReactNode): Icon {
  return (props: Props) => <Base {...props}>{paths}</Base>
}

/* -- Icon exports ---------------------------------------------------------- */

export const Activity = make(<path d="M2 12h4l3-3 3 3 3-3 3 3h4" />)

export const AlertTriangle = make(
  <>
    <path d="M12 2L2 22h20L12 2z" />
    <line x1="12" y1="9" x2="12" y2="15" />
    <circle cx="12" cy="19" r="1" />
  </>,
)

export const ArrowRight = make(
  <>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 19 19 12 12 5" />
  </>
)

export const Building2 = make(
  <>
    <rect x="4" y="9" width="16" height="11" rx="2" />
    <path d="M9 9V5a3 3 0 0 1 6 0v4" />
    <path d="M8 13h1" />
    <path d="M15 13h1" />
  </>
)

export const Check = make(<polyline points="20 6 9 15 4 10" />)

export const CheckCircle2 = make(
  <>
    <circle cx="12" cy="12" r="10" />
    <polyline points="16 10 12 14 10 12" />
  </>
)

export const ChevronDown = make(<polyline points="6 10 12 16 18 10" />)

export const ClipboardList = make(
  <>
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M14 2h2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h2" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
  </>
)

export const Clock = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 15" />
  </>
)

export const Eye = make(
  <>
    <path d="M1 12s7-7 11-7 11 7 11 7-7 7-11 7-11-7-11-7z" />
    <circle cx="12" cy="12" r="3" />
  </>
)

export const GraduationCap = make(
  <>
    <path d="M20.24 10.24L12 4l-8.24 6.24A2 2 0 0 0 3 12v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-.76-1.76z" />
    <path d="M12 14V8" />
    <path d="M12 14l-4-4" />
    <path d="M12 14l4 4" />
  </>
)

export const Globe = make(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <line x1="2" y1="12" x2="22" y2="12" />
  </>
)

export const Layers = make(
  <>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </>
)

export const LayoutDashboard = make(
  <>
    <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5" />
    <path d="M3 12.5V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4.5" />
    <path d="M5 17V7" />
    <path d="M19 17V7" />
  </>
)

export const ListChecks = make(
  <>
    <path d="M9 12h6" />
    <path d="M9 16h6" />
    <path d="M9 8h6" />
    <path d="M5 6h14v14H5z" />
  </>
)

export const Loader2 = make(
  <path d="M12 22a10 10 0 0 1-10-10A10 10 0 1 1 12 22z" />
)

export const LogOut = make(
  <>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 19 19 12 12 5" />
  </>
)

export const MapPin = make(
  <>
    <path d="M20 10.5c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10.5" r="3" />
  </>
)

export const Menu = make(
  <>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </>
)

export const Pencil = make(
  <>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.5 2.5 0 0 1 3.5 3.5L12 15l-4 1 1-4z" />
  </>
)

export const Plus = make(
  <>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </>
)

export const Search = make(
  <>
    <circle cx="10" cy="10" r="7" />
    <line x1="15" y1="15" x2="19" y2="19" />
  </>
)

export const Sun = make(
  <>
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="2" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </>
)

export const Moon = make(
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
)

export const Stethoscope = make(
  <>
    <path d="M4 4h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
    <circle cx="8" cy="16" r="3" />
    <circle cx="16" cy="16" r="3" />
  </>
)

export const Trash2 = make(
  <>
    <path d="M9 3v3m6-3v3" />
    <path d="M20 6l-2 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L4 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 20h6" />
  </>
)

export const Users = make(
  <>
    <path d="M16 21v-2a4 4 0 0 0-5.9-3.6" />
    <path d="M9 10a4 4 0 1 1 8 0 4 4 0 0 1-8 0z" />
    <circle cx="12" cy="7" r="3" />
  </>
)

export const UserPlus = make(
  <>
    <path d="M16 21v-2a4 4 0 0 0-8 0v2" />
    <circle cx="12" cy="7" r="4" />
    <line x1="22" y1="11" x2="16" y2="11" />
    <line x1="19" y1="8" x2="19" y2="14" />
  </>
)

export const KeyRound = make(
  <>
    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
  </>
)

export const Upload = make(
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </>
)

export const ShieldCheck = make(
  <>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 11 11 13 15 9" />
  </>
)

export const Mail = make(
  <>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 8l10 5 10-5" />
  </>
)

export const X = make(
  <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>
)

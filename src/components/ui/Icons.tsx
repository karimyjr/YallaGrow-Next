// Central icon library for YallaGrow.
// Minimal line SVGs, 24x24, currentColor stroke so they inherit text color.
// Usage: <Icon name="target" size={20} />  or  <Icon name="dollar" />
//
// To add a new icon: paste its <path>/<circle>/<line> contents into the ICONS map below.
// Source: lucide.dev (MIT-licensed), hand-adapted for consistency.

import React from 'react'

type IconName =
  // Services
  | 'target' | 'phone' | 'dollar' | 'palette' | 'film' | 'pen'
  | 'globe' | 'bar-chart' | 'brain' | 'rocket' | 'briefcase' | 'bolt'
  // Content & marketing
  | 'camera' | 'video' | 'music' | 'megaphone' | 'image' | 'document'
  | 'scissors' | 'edit' | 'sparkle' | 'star'
  // Admin / data
  | 'inbox' | 'package' | 'wrench' | 'clipboard' | 'mail' | 'handshake'
  | 'users' | 'user' | 'building' | 'graduation' | 'folder'
  // UI
  | 'search' | 'trash' | 'close' | 'menu' | 'link' | 'paperclip'
  | 'download' | 'upload' | 'calendar' | 'map-pin' | 'chat'
  | 'check' | 'alert' | 'info' | 'help' | 'lock' | 'unlock'
  | 'home' | 'chart-up' | 'eye' | 'cookie'
  // Status
  | 'dot-red' | 'dot-green' | 'dot-yellow' | 'dot-blue'

const ICONS: Record<IconName, React.ReactNode> = {
  // ───────── Services ─────────
  target: (<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>),
  phone: (<rect x="5" y="2" width="14" height="20" rx="2.5"/>),
  dollar: (<><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 7H9.5a2.5 2.5 0 000 5h5a2.5 2.5 0 010 5H6"/></>),
  palette: (<><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2a10 10 0 100 20c1.1 0 2-.9 2-2 0-.3-.1-.5-.2-.7-.1-.3-.2-.5-.2-.8 0-1.1.9-2 2-2h2.4a4 4 0 004-4C22 6.5 17.5 2 12 2z"/></>),
  film: (<><rect x="2" y="2" width="20" height="20" rx="2.5"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></>),
  pen: (<><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><line x1="2" y1="2" x2="9.586" y2="9.586"/><circle cx="11" cy="11" r="2"/></>),
  globe: (<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/></>),
  'bar-chart': (<><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>),
  brain: (<path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96.44 2.5 2.5 0 01-2.96-3.08 3 3 0 01-.34-5.58 2.5 2.5 0 011.32-4.24 2.5 2.5 0 014.44-1.04zM14.5 2A2.5 2.5 0 0012 4.5v15a2.5 2.5 0 004.96.44 2.5 2.5 0 002.96-3.08 3 3 0 00.34-5.58 2.5 2.5 0 00-1.32-4.24 2.5 2.5 0 00-4.44-1.04z"/>),
  rocket: (<path d="M4.5 16.5c-1.5 1.3-2 5.3-2 5.3s4-.5 5.3-2c.8-.9.8-2.2 0-3-.9-.8-2.3-.8-3.3-.3zM12 15l-3-3 7-7a5 5 0 015 5l-7 7zM12 15l-3-3a22 22 0 00-5 5l3 3a22 22 0 005-5z"/>),
  briefcase: (<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></>),
  bolt: (<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>),

  // ───────── Content & marketing ─────────
  camera: (<><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></>),
  video: (<><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></>),
  music: (<><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>),
  megaphone: (<><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 11-5.8-1.6"/></>),
  image: (<><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></>),
  document: (<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></>),
  scissors: (<><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></>),
  edit: (<><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></>),
  sparkle: (<path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2z"/>),
  star: (<polygon points="12 2 15 9 22 10 17 15 18 22 12 19 6 22 7 15 2 10 9 9 12 2"/>),

  // ───────── Admin / data ─────────
  inbox: (<><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></>),
  package: (<><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>),
  wrench: (<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>),
  clipboard: (<><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/></>),
  mail: (<><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/></>),
  handshake: (<path d="M11 17L8 20l-4-4 4-4 3 3 5-5-4-4 4-4 8 8-7 7-6-6-4 4z"/>),
  users: (<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>),
  user: (<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>),
  building: (<><rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="22" x2="9" y2="18"/><line x1="15" y1="22" x2="15" y2="18"/><line x1="8" y1="6" x2="10" y2="6"/><line x1="14" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/></>),
  graduation: (<><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></>),
  folder: (<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>),

  // ───────── UI ─────────
  search: (<><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>),
  trash: (<><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>),
  close: (<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>),
  menu: (<><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>),
  link: (<><path d="M10 14a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1.5 1.5"/><path d="M14 10a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1.5-1.5"/></>),
  paperclip: (<path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>),
  download: (<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>),
  upload: (<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>),
  calendar: (<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>),
  'map-pin': (<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>),
  chat: (<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>),
  check: (<polyline points="20 6 9 17 4 12"/>),
  alert: (<><path d="M10.3 3.86L1.82 18a2 2 0 001.72 3h16.92a2 2 0 001.72-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>),
  info: (<><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>),
  help: (<><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>),
  lock: (<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>),
  unlock: (<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/></>),
  home: (<><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/></>),
  'chart-up': (<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>),
  eye: (<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>),
  cookie: (<><path d="M12 2a10 10 0 1010 10 4 4 0 01-5-5 4 4 0 01-5-5"/><circle cx="8.5" cy="8.5" r=".5" fill="currentColor"/><circle cx="15.5" cy="15.5" r=".5" fill="currentColor"/><circle cx="15" cy="9" r=".5" fill="currentColor"/><circle cx="8" cy="15" r=".5" fill="currentColor"/></>),

  // ───────── Status dots (filled) ─────────
  'dot-red': (<circle cx="12" cy="12" r="6" fill="#ff4d4d" stroke="none"/>),
  'dot-green': (<circle cx="12" cy="12" r="6" fill="#16db64" stroke="none"/>),
  'dot-yellow': (<circle cx="12" cy="12" r="6" fill="#ffc107" stroke="none"/>),
  'dot-blue': (<circle cx="12" cy="12" r="6" fill="#10a1db" stroke="none"/>),
}

interface IconProps {
  name: IconName
  size?: number
  color?: string
  style?: React.CSSProperties
  className?: string
  strokeWidth?: number
}

export function Icon({ name, size = 20, color, style, className, strokeWidth = 1.75 }: IconProps) {
  const content = ICONS[name]
  if (!content) return null
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle', ...style }}
      className={className}
      aria-hidden="true"
    >
      {content}
    </svg>
  )
}

export default Icon

import type { SVGProps } from "react";

export type IconName = "menu" | "search" | "heart" | "cart" | "user" | "arrow" | "check" | "upload" | "ruler" | "eye" | "whatsapp" | "star" | "close" | "home" | "shop" | "wand" | "calculator" | "shield" | "truck" | "sparkles" | "plus" | "minus" | "trash" | "download" | "filter";

const paths: Record<IconName, React.ReactNode> = {
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
  cart: <><circle cx="9" cy="20" r="1" /><circle cx="19" cy="20" r="1" /><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M4 20h16" /></>,
  ruler: <><path d="M4 19 19 4l2 2L6 21H4v-2Z" /><path d="m13 8 3 3M9 12l3 3M5 16l3 3" /></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  whatsapp: <><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.8-5.4A8.5 8.5 0 1 1 21 11.5Z" /><path d="M8.5 8.5c.7 3 2.1 4.4 5 5" /></>,
  star: <path d="m12 2 3 6 6.5 1-4.8 4.7 1.1 6.5L12 17.2l-5.8 3 1.1-6.5L2.5 9 9 8l3-6Z" />,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-6h6v6" /></>,
  shop: <><path d="M4 10h16l-1 11H5L4 10Z" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  wand: <><path d="m15 4 5 5L8 21l-5-5L15 4Z" /><path d="m6 4 1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1ZM18 15l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z" /></>,
  calculator: <><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h2M14 18h2" /></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
  truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
  sparkles: <><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z" /><path d="m19 14 .7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14ZM5 14l.7 2.3L8 17l-2.3.7L5 20l-.7-2.3L2 17l2.3-.7L5 14Z" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14" /></>,
  download: <><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></>,
  filter: <><path d="M4 5h16M7 12h10M10 19h4" /></>,
};

export function Icon({ name, size = 22, className = "", ...props }: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {paths[name]}
    </svg>
  );
}

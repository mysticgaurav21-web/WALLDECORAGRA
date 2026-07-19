"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/icons";

const links: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/wallpapers", label: "Shop", icon: "shop" },
  { href: "/customize", label: "Customize", icon: "wand" },
  { href: "/visualizer", label: "Visualize", icon: "eye" },
  { href: "/cart", label: "Cart", icon: "cart" },
];

export function MobileNav() {
  const pathname = usePathname();
  return <nav className="mobile-bottom-nav">{links.map((item) => <Link className={pathname === item.href ? "active" : ""} key={item.href} href={item.href}><Icon name={item.icon} size={20} /><span>{item.label}</span></Link>)}</nav>;
}

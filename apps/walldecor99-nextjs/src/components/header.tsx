"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Icon } from "@/components/icons";

const nav = [
  ["Shop", "/wallpapers"],
  ["Customize", "/customize"],
  ["Visualizer", "/visualizer"],
  ["Roll Calculator", "/calculator"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  return (
    <>
      <div className="announcement">Free design consultation • Installation available in selected Indian cities</div>
      <header className="site-header">
        <div className="container header-inner">
          <button className="icon-button mobile-only" onClick={() => setOpen(true)} aria-label="Open menu"><Icon name="menu" /></button>
          <Link className="brand" href="/" aria-label="WallDecor99 home">
            <span className="brand-mark">WD</span><span>WallDecor<span>99</span></span>
          </Link>
          <nav className="desktop-nav" aria-label="Primary navigation">
            {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <div className="header-actions">
            <Link className="icon-button desktop-only" href="/wallpapers" aria-label="Search"><Icon name="search" /></Link>
            <Link className="icon-button desktop-only" href="/account" aria-label="Account"><Icon name="user" /></Link>
            <Link className="icon-button cart-button" href="/cart" aria-label={`Cart with ${count} items`}><Icon name="cart" />{count > 0 && <span>{count}</span>}</Link>
          </div>
        </div>
      </header>
      {open && (
        <div className="drawer-backdrop" onClick={() => setOpen(false)}>
          <aside className="mobile-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head"><span className="brand">WallDecor<span>99</span></span><button className="icon-button" onClick={() => setOpen(false)}><Icon name="close" /></button></div>
            <nav>{nav.map(([label, href]) => <Link onClick={() => setOpen(false)} key={href} href={href}>{label}<Icon name="arrow" size={18} /></Link>)}</nav>
            <Link onClick={() => setOpen(false)} className="button button-primary full" href="/cart">Open Cart ({count})</Link>
          </aside>
        </div>
      )}
    </>
  );
}

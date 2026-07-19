"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { useCart } from "@/context/cart-context";
import { formatINR } from "@/lib/calculations";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const delivery = subtotal >= 5000 ? 0 : 299;
  const gst = subtotal * .18;
  const total = subtotal + delivery + gst;
  const message = `Hello WallDecor99, I want to place an order for:\n${items.map((item) => `• ${item.name} × ${item.quantity} — ${formatINR(item.unitPrice * item.quantity)}`).join("\n")}\nSubtotal: ${formatINR(subtotal)}\nEstimated total incl. GST and delivery: ${formatINR(total)}`;
  return (
    <>
      <section className="page-hero"><div className="container"><div className="breadcrumbs"><span>Home</span><span>/</span><span>Cart</span></div><span className="eyebrow">Review your selections</span><h1>Your cart</h1><p>Ready rolls, custom designs and installation services can be checked out together.</p></div></section>
      <section className="section"><div className="container">
        {items.length === 0 ? <div className="empty-cart"><Icon name="cart" size={55} /><h2>Your cart is empty</h2><p>Explore the collection or create a custom wallpaper to get started.</p><div className="button-group" style={{ justifyContent: "center" }}><Link className="button button-primary" href="/wallpapers">Shop wallpapers</Link><Link className="button button-outline" href="/customize">Create custom wallpaper</Link></div></div> : <div className="cart-layout">
          <div className="cart-list">{items.map((item) => <article className="cart-item" key={item.id}><Image src={item.image} alt={item.name} width={160} height={180} unoptimized={item.image.startsWith("blob:")} /><div><span className="eyebrow">{item.type.replace("-", " ")}</span><h3>{item.name}</h3><p>{item.meta ? Object.entries(item.meta).slice(0, 3).map(([key, value]) => `${key}: ${value}`).join(" • ") : "WallDecor99 product"}</p><strong>{formatINR(item.unitPrice)}</strong></div><div className="cart-item-actions"><button className="delete-button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`}><Icon name="trash" /></button><div className="quantity-control"><button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Icon name="minus" size={16} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Icon name="plus" size={16} /></button></div><strong>{formatINR(item.unitPrice * item.quantity)}</strong></div></article>)}</div>
          <aside className="order-summary"><h3>Order summary</h3><div className="order-summary-row"><span>Subtotal</span><b>{formatINR(subtotal)}</b></div><div className="order-summary-row"><span>Delivery</span><b>{delivery === 0 ? "Free" : formatINR(delivery)}</b></div><div className="order-summary-row"><span>GST estimate</span><b>{formatINR(gst)}</b></div><div className="coupon-box"><input placeholder="Coupon code" /><button className="button button-light">Apply</button></div><div className="order-summary-total"><span>Estimated total</span><strong>{formatINR(total)}</strong></div><Link className="button button-primary full" href="/checkout">Proceed to checkout</Link><a className="button whatsapp-button full" style={{ marginTop: 9 }} href={createWhatsAppUrl(message)} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={18} /> Checkout on WhatsApp</a><Link className="button button-light full" style={{ marginTop: 9 }} href="/quotation/demo">Generate quotation</Link><p className="disclaimer">Production checkout will create a server-verified order and open Razorpay/UPI or COD based on order eligibility.</p></aside>
        </div>}
      </div></section>
    </>
  );
}

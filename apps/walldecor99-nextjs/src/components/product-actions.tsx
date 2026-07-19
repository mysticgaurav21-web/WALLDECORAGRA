"use client";

import type { Product } from "@/types";
import { useCart } from "@/context/cart-context";
import { Icon } from "@/components/icons";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const add = () => addItem({ id: product.id, name: product.name, image: product.image, unitPrice: product.price, quantity: 1, type: "ready-roll", meta: { sku: product.sku, material: product.material } });
  const message = `Hello WallDecor99, I am interested in ${product.name} (${product.sku}). Please share availability, delivery and installation details.`;
  return (
    <>
      <div className="product-actions">
        <button className="button button-primary" onClick={add}><Icon name="cart" size={18} /> Add to cart</button>
        <a className="button whatsapp-button" href={createWhatsAppUrl(message)} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={18} /> Enquire</a>
      </div>
      <div className="button-group">
        <a className="button button-outline" href="#calculator"><Icon name="calculator" size={18} /> Calculate rolls</a>
        <a className="button button-outline" href={`/visualizer?wallpaper=${product.slug}`}><Icon name="eye" size={18} /> Visualize</a>
      </div>
    </>
  );
}

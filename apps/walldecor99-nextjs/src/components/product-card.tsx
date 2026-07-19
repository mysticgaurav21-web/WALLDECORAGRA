"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { Icon } from "@/components/icons";
import { formatINR } from "@/lib/calculations";
import { useCart } from "@/context/cart-context";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`} className="product-image-wrap">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <Image className="product-image" src={product.image} alt={`${product.name} wallpaper pattern`} width={600} height={750} />
        <button className="wish-button" aria-label="Add to wishlist" onClick={(event) => event.preventDefault()}><Icon name="heart" size={19} /></button>
      </Link>
      <div className="product-card-body">
        <div className="eyebrow-row"><span>{product.category}</span><span><Icon name="star" size={14} /> {product.rating}</span></div>
        <Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link>
        <p className="product-code">{product.sku} • {product.material}</p>
        <div className="price-row"><strong>{formatINR(product.price)}</strong>{product.originalPrice && <del>{formatINR(product.originalPrice)}</del>}<span>/ roll</span></div>
        <button className="button button-outline full" onClick={() => addItem({ id: product.id, name: product.name, image: product.image, unitPrice: product.price, quantity: 1, type: "ready-roll", meta: { sku: product.sku } })}>Quick add</button>
      </div>
    </article>
  );
}

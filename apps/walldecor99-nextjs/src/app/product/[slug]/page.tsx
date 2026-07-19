import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { Icon } from "@/components/icons";
import { ProductActions } from "@/components/product-actions";
import { RollCalculator } from "@/components/roll-calculator";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { formatINR } from "@/lib/calculations";

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((entry) => entry.slug === slug);
  if (!product) notFound();
  const related = products.filter((entry) => entry.id !== product.id).slice(0, 4);
  return (
    <>
      <section className="section"><div className="container product-detail">
        <div className="product-gallery-main"><Image src={product.roomImage} alt={`${product.name} room preview`} fill priority /></div>
        <div className="product-info">
          <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/wallpapers">Wallpapers</Link><span>/</span><span>{product.name}</span></div>
          <span className="eyebrow">{product.category} collection</span><h1>{product.name}</h1>
          <div className="product-rating"><Icon name="star" size={17} /> <strong>{product.rating}</strong><span>({product.reviewCount} verified reviews)</span></div>
          <div className="product-price"><strong>{formatINR(product.price)}</strong>{product.originalPrice && <del>{formatINR(product.originalPrice)}</del>}<span>/ roll</span></div><span className="tax-note">Inclusive of applicable taxes • EMI/payment options at checkout</span>
          <p className="product-description">{product.description}</p>
          <div className="spec-grid"><div><span>Product code</span><strong>{product.sku}</strong></div><div><span>Material</span><strong>{product.material}</strong></div><div><span>Roll size</span><strong>{product.rollWidthFt} × {product.rollLengthFt} ft</strong></div><div><span>Pattern repeat</span><strong>{product.patternRepeatIn} inches</strong></div><div><span>Availability</span><strong>{product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}</strong></div><div><span>Delivery</span><strong>5–9 business days</strong></div></div>
          <ProductActions product={product} />
          <div className="promise-list"><div><Icon name="shield" /><strong>Quality checked</strong></div><div><Icon name="truck" /><strong>Safe delivery</strong></div><div><Icon name="ruler" /><strong>Install support</strong></div></div>
          <div className="tab-card"><h3>Product details</h3><p>Premium wallcovering produced for smooth, prepared interior walls. Colours may vary slightly between screens and physical print. Order a sample or speak with our team when colour matching is critical.</p><p><strong>Care:</strong> Wipe gently with a soft damp cloth. Avoid abrasive cleaners and installation on damp walls.</p></div>
        </div>
      </div></section>
      <section className="section alt" id="calculator"><div className="container"><SectionHeading eyebrow="Quantity planning" title={`How many ${product.name} rolls do you need?`} copy="Wall width, height, openings and pattern repeat are used to calculate vertical drops and the recommended quantity." /><RollCalculator defaultPrice={product.price} /></div></section>
      <section className="section"><div className="container"><SectionHeading eyebrow="You may also like" title="More designs for your shortlist" /><div className="product-grid">{related.map((entry) => <ProductCard key={entry.id} product={entry} />)}</div></div></section>
    </>
  );
}

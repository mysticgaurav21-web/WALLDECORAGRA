import Link from "next/link";
import { PrintButton } from "@/components/print-button";
import { Icon } from "@/components/icons";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { formatINR } from "@/lib/calculations";

export const metadata = { title: "Quotation Demo" };

export default function QuotationDemoPage() {
  const subtotal = 120 * 110 + 1200 + 3000 + 700;
  const gst = subtotal * .18;
  const total = subtotal + gst;
  const message = `WallDecor99 Quotation WDQ-260719-014\nCustom wallpaper — 12 ft × 10 ft\nPremium Vinyl\nGrand total: ${formatINR(total)}\nValid until 26 July 2026.`;
  return <section className="section"><div className="container"><div className="print-actions"><Link className="button button-outline" href="/cart">Back to cart</Link><PrintButton /><a className="button whatsapp-button" href={createWhatsAppUrl(message)} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={18} /> Share summary</a></div><article className="quotation">
    <header className="quote-head"><div><div className="brand"><span className="brand-mark">WD</span><span>WallDecor<span>99</span></span></div><p style={{ margin: "12px 0 0" }}>Premium Wallpapers & Custom Murals<br />Agra, Uttar Pradesh, India</p></div><div className="quote-meta"><div className="quote-title">QUOTATION</div><p><strong>No:</strong> WDQ-260719-014<br /><strong>Date:</strong> 19 July 2026<br /><strong>Valid until:</strong> 26 July 2026</p></div></header>
    <section className="quote-parties"><div><h4>Quotation for</h4><p><strong>Demo Customer</strong><br />+91 98XXXXXX12<br />Agra, Uttar Pradesh<br />demo@example.com</p></div><div><h4>Project details</h4><p><strong>Room:</strong> Living Room Feature Wall<br /><strong>Wall:</strong> 12 ft × 10 ft<br /><strong>Printable area:</strong> 120 sq ft<br /><strong>Installation:</strong> Required</p></div></section>
    <table className="quote-table"><thead><tr><th>Description</th><th>Qty/Area</th><th>Rate</th><th>Amount</th></tr></thead><tbody><tr><td><strong>Custom Wallpaper Printing</strong><br />Premium Vinyl • Matte satin finish</td><td>120 sq ft</td><td>₹110/sq ft</td><td>{formatINR(13200)}</td></tr><tr><td>Design adaptation & print proof</td><td>1 service</td><td>₹1,200</td><td>{formatINR(1200)}</td></tr><tr><td>Professional wallpaper installation</td><td>120 sq ft</td><td>₹25/sq ft</td><td>{formatINR(3000)}</td></tr><tr><td>Protected delivery & handling</td><td>1 shipment</td><td>₹700</td><td>{formatINR(700)}</td></tr></tbody></table>
    <div className="quote-totals"><div><span>Subtotal</span><b>{formatINR(subtotal)}</b></div><div><span>Discount</span><b>₹0</b></div><div><span>GST (18%)</span><b>{formatINR(gst)}</b></div><div className="total"><span>Grand Total</span><b>{formatINR(total)}</b></div></div>
    <div className="quote-terms"><h4>Terms & Conditions</h4><ol><li>50% advance is required to begin custom design and production.</li><li>Final print production starts after customer proof approval.</li><li>Uploaded artwork quality and colour appearance may vary between screens and print media.</li><li>Installation pricing assumes a smooth, dry and prepared wall. Repair work is quoted separately.</li><li>Custom-printed products cannot be returned after artwork approval except for verified manufacturing defects.</li></ol><p style={{ marginTop: 30 }}><strong>Authorized by WallDecor99</strong><br />This is a system-generated quotation demo.</p></div>
  </article></div></section>;
}

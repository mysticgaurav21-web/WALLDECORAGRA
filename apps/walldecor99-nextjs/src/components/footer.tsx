import Link from "next/link";
import { Icon } from "@/components/icons";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="brand light"><span className="brand-mark">WD</span><span>WallDecor<span>99</span></span></div>
          <p>Premium wallpapers, made-to-measure murals and expert installation for homes and businesses across India.</p>
          <a className="footer-whatsapp" href="https://wa.me/919999999999"><Icon name="whatsapp" /> Chat with a wallpaper expert</a>
        </div>
        <div><h4>Shop</h4><Link href="/wallpapers">Ready Rolls</Link><Link href="/customize">Custom Wallpaper</Link><Link href="/visualizer">Room Visualizer</Link><Link href="/calculator">Roll Calculator</Link></div>
        <div><h4>Support</h4><Link href="/quotation/demo">Sample Quotation</Link><Link href="/cart">Cart & Checkout</Link><Link href="/admin">Admin Demo</Link><a href="mailto:hello@walldecor99.in">hello@walldecor99.in</a></div>
        <div><h4>Visit us</h4><p>Agra, Uttar Pradesh</p><p>Mon–Sat, 10 AM–7 PM</p><p>India-wide product delivery</p></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 WallDecor99. All rights reserved.</span><span>Built for fast mobile shopping.</span></div>
    </footer>
  );
}

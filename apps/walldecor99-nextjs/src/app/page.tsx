import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { products, rooms } from "@/data/products";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <Image className="hero-art" src="/hero-room.svg" alt="Premium living room with designer botanical wallpaper" fill priority />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <span className="eyebrow"><Icon name="sparkles" size={16} /> Made for your walls</span>
          <h1>Walls that feel <em>uniquely yours.</em></h1>
          <p>Shop premium wallpaper rolls or create a made-to-measure design with your photos, dimensions and preferred material.</p>
          <div className="button-group">
            <Link className="button button-primary" href="/wallpapers">Shop wallpapers <Icon name="arrow" size={18} /></Link>
            <Link className="button button-ghost" href="/customize">Customize your wall</Link>
          </div>
          <div className="hero-trust"><span><Icon name="check" size={16} /> Pan-India delivery</span><span><Icon name="check" size={16} /> Secure payment</span><span><Icon name="check" size={16} /> Expert installation</span></div>
        </div>
        <div className="hero-quick-actions">
          <Link href="/calculator"><Icon name="calculator" /><div><strong>Calculate Rolls</strong><small>Get an accurate quantity</small></div></Link>
          <Link href="/visualizer"><Icon name="eye" /><div><strong>Visualize a Room</strong><small>Preview before purchase</small></div></Link>
          <Link href="/customize"><Icon name="upload" /><div><strong>Upload Your Photo</strong><small>Create personal wallpaper</small></div></Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Choose your journey" title="Two simple ways to transform a wall" copy="Buy a ready roll for fast installation or create a perfectly sized custom wallpaper for a one-of-a-kind space." />
          <div className="type-grid">
            <Link className="type-card roll" href="/wallpapers"><div><span className="eyebrow">Ready Roll</span><h3>Curated designs, ready to order.</h3><p>Browse fixed-size rolls, calculate quantity and order in minutes.</p><span className="button button-light">Explore collection <Icon name="arrow" size={18} /></span></div></Link>
            <Link className="type-card custom" href="/customize"><div><span className="eyebrow">Made to Measure</span><h3>Your image. Your size. Your story.</h3><p>Upload personal photos, choose material and get live pricing.</p><span className="button button-light">Start customizing <Icon name="wand" size={18} /></span></div></Link>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHeading eyebrow="Shop by room" title="Find the right mood for every space" />
          <div className="room-grid">
            {rooms.map((room) => <Link key={room.name} className="room-card" href={`/wallpapers?room=${encodeURIComponent(room.name)}`}><div className="room-image"><Image src={room.image} alt={`${room.name} wallpaper inspiration`} fill /></div><h3>{room.name}</h3></Link>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Popular now" title="Designs customers keep coming back for" copy="Premium textures, calm neutrals and statement patterns selected for Indian homes and commercial interiors." />
          <div className="product-grid">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div>
          <div style={{ textAlign: "center", marginTop: 32 }}><Link className="button button-outline" href="/wallpapers">View all wallpapers <Icon name="arrow" size={18} /></Link></div>
        </div>
      </section>

      <section className="feature-strip">
        <div className="container">
          <div className="feature-item"><Icon name="shield" /><div><strong>Print quality checked</strong><small>Resolution validation before production</small></div></div>
          <div className="feature-item"><Icon name="ruler" /><div><strong>Accurate calculator</strong><small>Pattern repeat and wastage included</small></div></div>
          <div className="feature-item"><Icon name="truck" /><div><strong>India-wide delivery</strong><small>Protected packaging and tracking</small></div></div>
          <div className="feature-item"><Icon name="whatsapp" /><div><strong>WhatsApp assistance</strong><small>Talk to a wallpaper expert</small></div></div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHeading align="center" eyebrow="Custom wallpaper" title="From idea to finished wall in four steps" copy="A guided process designed for mobile customers—not a complicated professional design tool." />
          <div className="process-grid">
            {[['Choose', 'Select a category, template or upload your own image.'], ['Measure', 'Enter exact wall size and subtract doors or windows.'], ['Personalize', 'Choose material, placement and optional design support.'], ['Approve', 'Check quality, price and preview before ordering.']].map(([title, copy], index) => <div className="process-card" key={title}><span className="process-number">{index + 1}</span><h3>{title}</h3><p>{copy}</p></div>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="visualizer-banner">
            <div className="visual-copy"><span className="eyebrow">Room visualizer</span><h2>See the wallpaper on your wall before you order.</h2><p>Upload a room photo, apply different patterns, adjust scale and compare your options.</p><div><Link className="button button-primary" href="/visualizer">Visualize your room <Icon name="eye" size={18} /></Link></div></div>
            <div className="visualizer-image" />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="quote-card">
            <div><span className="eyebrow" style={{ color: "#ffe0cf" }}>Need expert help?</span><h2>Send your wall size and get a detailed quotation.</h2><p>Product, material, printing, GST and installation—all clearly explained.</p></div>
            <Link className="button button-light" href="/quotation/demo">View quotation demo <Icon name="arrow" size={18} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

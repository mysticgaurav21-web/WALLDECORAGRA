"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Icon, type IconName } from "@/components/icons";
import { materials } from "@/data/products";
import { calculateImageQuality, formatINR } from "@/lib/calculations";
import { useCart } from "@/context/cart-context";
import { createWhatsAppUrl } from "@/lib/whatsapp";

const types: { id: string; label: string; copy: string; icon: IconName }[] = [
  { id: "template", label: "Use a template", copy: "Choose a WallDecor99 design and adapt it to your wall.", icon: "wand" },
  { id: "photo", label: "Upload a photo", copy: "Turn a family, wedding or travel photo into a mural.", icon: "upload" },
  { id: "collage", label: "Photo collage", copy: "Combine multiple memories with optional text and dates.", icon: "sparkles" },
  { id: "kids", label: "Kids wallpaper", copy: "Names, birthdays, cartoons and educational themes.", icon: "star" },
  { id: "business", label: "Business branding", copy: "Logos, menus, office values and commercial artwork.", icon: "shop" },
  { id: "assisted", label: "Designer assistance", copy: "Share your brief and let our design team prepare a proof.", icon: "user" },
];
const steps = ["Choose type", "Wall details", "Upload artwork", "Select material", "Preview & price"];

export default function CustomizePage() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState("photo");
  const [wall, setWall] = useState({ width: 12, height: 10, excluded: 0, installation: true });
  const [preview, setPreview] = useState<string>("/wallpapers/terracotta-bloom.svg");
  const [fileName, setFileName] = useState("Demo artwork");
  const [imageSize, setImageSize] = useState({ width: 4800, height: 4000 });
  const [materialId, setMaterialId] = useState(materials[1].id);
  const { addItem } = useCart();

  const material = materials.find((entry) => entry.id === materialId) || materials[0];
  const quality = calculateImageQuality(imageSize.width, imageSize.height, wall.width, wall.height);
  const price = useMemo(() => {
    const netArea = Math.max(1, wall.width * wall.height - wall.excluded);
    const billableArea = Math.max(50, netArea);
    const materialCost = billableArea * material.pricePerSqFt;
    const designFee = type === "assisted" || type === "collage" ? 1200 : 500;
    const installation = wall.installation ? netArea * 25 : 0;
    const subtotal = materialCost + designFee + installation;
    return { netArea, billableArea, materialCost, designFee, installation, gst: subtotal * .18, total: subtotal * 1.18 };
  }, [wall, material, type]);

  const handleUpload = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please upload a JPG, PNG or WebP image for this demo.");
    const objectUrl = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setPreview(objectUrl);
      setFileName(file.name);
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = objectUrl;
  };

  const addCustomToCart = () => {
    addItem({ id: `custom-${Date.now()}`, name: `Custom ${types.find((entry) => entry.id === type)?.label || "Wallpaper"}`, image: preview, unitPrice: Math.round(price.total), quantity: 1, type: "custom", meta: { wallWidth: wall.width, wallHeight: wall.height, material: material.name, quality: quality.label, fileName } });
    alert("Custom wallpaper has been added to your cart.");
  };
  const message = `Hello WallDecor99, I want a custom wallpaper.\nType: ${types.find((entry) => entry.id === type)?.label}\nWall: ${wall.width} ft × ${wall.height} ft\nArea: ${price.netArea} sq ft\nMaterial: ${material.name}\nImage quality: ${quality.label} (${quality.dpi} DPI)\nEstimated total: ${formatINR(price.total)}`;

  return (
    <>
      <section className="page-hero"><div className="container"><div className="breadcrumbs"><span>Home</span><span>/</span><span>Custom Wallpaper</span></div><span className="eyebrow">Made to measure</span><h1>Create wallpaper that exists nowhere else.</h1><p>Upload your artwork, enter wall size, choose material and get an instant print-quality and pricing estimate.</p></div></section>
      <section className="section"><div className="container">
        <div className="studio-shell">
          <aside className="studio-sidebar"><h3>Your design journey</h3><div className="studio-steps">{steps.map((label, index) => <div className={`studio-step ${index === step ? "active" : index < step ? "done" : ""}`} key={label}><b>{index < step ? <Icon name="check" size={13} /> : index + 1}</b><span>{label}</span></div>)}</div></aside>
          <div className="studio-content">
            <div className="studio-panel">
              {step === 0 && <><span className="eyebrow">Step 1 of 5</span><h2>What would you like to create?</h2><p>Choose the closest option. You can still request changes later.</p><div className="choice-grid">{types.map((entry) => <button onClick={() => setType(entry.id)} className={`choice-card ${type === entry.id ? "selected" : ""}`} key={entry.id}><Icon name={entry.icon} /><strong>{entry.label}</strong><small>{entry.copy}</small></button>)}</div></>}
              {step === 1 && <><span className="eyebrow">Step 2 of 5</span><h2>Enter your wall measurements</h2><p>Use the finished wall width and height. Subtract large doors or windows where wallpaper will not be installed.</p><div className="form-grid" style={{ marginTop: 25 }}><label><span>Wall width (ft)</span><input type="number" value={wall.width} min="1" onChange={(e) => setWall({ ...wall, width: Number(e.target.value) })} /></label><label><span>Wall height (ft)</span><input type="number" value={wall.height} min="1" onChange={(e) => setWall({ ...wall, height: Number(e.target.value) })} /></label><label><span>Excluded area (sq ft)</span><input type="number" value={wall.excluded} min="0" onChange={(e) => setWall({ ...wall, excluded: Number(e.target.value) })} /></label><label><span>Printable area</span><input value={`${price.netArea} sq ft`} readOnly /></label></div><label className="check-row"><input type="checkbox" checked={wall.installation} onChange={(e) => setWall({ ...wall, installation: e.target.checked })} /><span><strong>Add professional installation</strong><small>Final serviceability will be checked using the delivery PIN code.</small></span></label></>}
              {step === 2 && <><span className="eyebrow">Step 3 of 5</span><h2>Upload your image or artwork</h2><p>High-resolution JPG, PNG or WebP files work best. Original files remain private in the production setup.</p><label className="upload-zone"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleUpload(e.target.files?.[0])} />{preview ? <Image src={preview} alt="Uploaded custom wallpaper artwork" width={600} height={400} unoptimized /> : <div><Icon name="upload" size={40} /><h3>Tap to upload artwork</h3><p>JPG, PNG or WebP • Demo limit handled in the browser</p></div>}</label><div className="quality-card"><div><strong>{fileName}</strong><span>{imageSize.width} × {imageSize.height} px • Target {wall.width} × {wall.height} ft</span></div><div className="quality-score">{quality.dpi} DPI</div></div><div className="quality-card" style={{ background: quality.dpi >= 72 ? "#eef5ef" : "#fff0eb", borderColor: quality.dpi >= 72 ? "#cbdcce" : "#e7b9aa" }}><div><strong>{quality.label}</strong><span>{quality.note}</span></div><Icon name={quality.dpi >= 72 ? "check" : "shield"} /></div></>}
              {step === 3 && <><span className="eyebrow">Step 4 of 5</span><h2>Choose your wallpaper material</h2><p>Rates are managed centrally. Material pricing below is calculated per square foot with a 50 sq ft minimum order.</p><div className="material-grid">{materials.map((entry) => <button onClick={() => setMaterialId(entry.id)} className={`material-card ${materialId === entry.id ? "selected" : ""}`} key={entry.id}><div className="material-head"><strong>{entry.name}</strong><b>{formatINR(entry.pricePerSqFt)}/sq ft</b></div><p>{entry.finish} • {entry.washable}</p><small>{entry.recommendedFor}</small></button>)}</div></>}
              {step === 4 && <><span className="eyebrow">Step 5 of 5</span><h2>Review your design and estimate</h2><p>This preview is for placement approval. Production files are reviewed separately before printing.</p><div className="preview-layout"><div className="design-preview" style={{ backgroundImage: `url(${preview})` }} /><aside className="price-summary"><h3>Price estimate</h3><div><span>Printable area</span><b>{price.netArea} sq ft</b></div><div><span>Billable area</span><b>{price.billableArea} sq ft</b></div><div><span>{material.name}</span><b>{formatINR(price.materialCost)}</b></div><div><span>Design handling</span><b>{formatINR(price.designFee)}</b></div><div><span>Installation</span><b>{formatINR(price.installation)}</b></div><div><span>GST (18%)</span><b>{formatINR(price.gst)}</b></div><div className="grand-total"><span>Estimated total</span><b>{formatINR(price.total)}</b></div><button className="button button-primary full" onClick={addCustomToCart}><Icon name="cart" size={18} /> Add to cart</button><a className="button whatsapp-button full" style={{ marginTop: 9 }} href={createWhatsAppUrl(message)} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={18} /> Ask an expert</a></aside></div></>}
            </div>
            <div className="studio-footer"><button className="button button-outline" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}>Back</button>{step < steps.length - 1 ? <button className="button button-primary" onClick={() => setStep(Math.min(steps.length - 1, step + 1))}>Continue <Icon name="arrow" size={18} /></button> : <button className="button button-dark" onClick={() => window.print()}><Icon name="download" size={18} /> Print estimate</button>}</div>
          </div>
        </div>
      </div></section>
    </>
  );
}

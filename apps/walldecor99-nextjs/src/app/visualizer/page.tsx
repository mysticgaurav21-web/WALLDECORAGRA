"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/icons";
import { products } from "@/data/products";
import { createWhatsAppUrl } from "@/lib/whatsapp";

export default function VisualizerPage() {
  const [roomImage, setRoomImage] = useState<string>("");
  const [pattern, setPattern] = useState(products[0].image);
  const [opacity, setOpacity] = useState(78);
  const [scale, setScale] = useState(210);
  const [brightness, setBrightness] = useState(100);
  const selected = products.find((item) => item.image === pattern) || products[0];

  const handleRoomUpload = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please upload an image file.");
    setRoomImage(URL.createObjectURL(file));
  };

  return (
    <>
      <section className="page-hero"><div className="container"><div className="breadcrumbs"><span>Home</span><span>/</span><span>Room Visualizer</span></div><span className="eyebrow">Preview before buying</span><h1>Try wallpaper on your own wall.</h1><p>Upload a room photo or use the demo room. Select a pattern and adjust scale, opacity and brightness. The first version uses a reliable manual wall region.</p></div></section>
      <section className="section"><div className="container">
        <div className="visualizer-shell">
          <div className="visualizer-toolbar"><div><strong>{selected.name}</strong><p style={{ margin: 0, color: "rgba(255,255,255,.6)", fontSize: 12 }}>{selected.sku} • Manual wall mask demo</p></div><div className="button-group"><label className="button button-light upload-room-label"><Icon name="upload" size={18} /> Upload room<input type="file" accept="image/*" onChange={(e) => handleRoomUpload(e.target.files?.[0])} /></label>{roomImage && <button className="button button-ghost" onClick={() => setRoomImage("")}>Use demo room</button>}<a className="button whatsapp-button" href={createWhatsAppUrl(`Hello WallDecor99, I created a room preview using ${selected.name} (${selected.sku}). Please help me with pricing and installation.`)} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={18} /> Enquire</a></div></div>
          <div className="visualizer-stage" style={{ filter: `brightness(${brightness}%)` }}>
            {roomImage && <Image className="room-upload" src={roomImage} alt="Uploaded room" fill unoptimized />}
            <div className="wall-overlay" style={{ backgroundImage: `url(${pattern})`, opacity: opacity / 100, backgroundSize: `${scale}px auto` }} />
            <div className="wall-guide" />
          </div>
          <div className="visualizer-controls">
            <div className="control-block"><label><span>Wallpaper scale</span><b>{scale}px</b></label><input type="range" min="90" max="420" value={scale} onChange={(e) => setScale(Number(e.target.value))} /></div>
            <div className="control-block"><label><span>Wallpaper opacity</span><b>{opacity}%</b></label><input type="range" min="20" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} /></div>
            <div className="control-block"><label><span>Room brightness</span><b>{brightness}%</b></label><input type="range" min="70" max="125" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} /></div>
          </div>
          <div className="pattern-picker" style={{ marginTop: 18 }}>{products.map((item) => <button key={item.id} className={`pattern-thumb ${pattern === item.image ? "active" : ""}`} style={{ backgroundImage: `url(${item.image})` }} onClick={() => setPattern(item.image)} aria-label={`Apply ${item.name}`} title={item.name} />)}</div>
        </div>
        <div className="tab-card" style={{ marginTop: 22 }}><h3>How the production visualizer will work</h3><p>Customers upload a room image, mark four or more wall corner points, adjust the wall polygon and apply a perspective-transformed pattern. The selected polygon, pattern scale and preview versions are stored separately from the original private upload. Automatic wall detection can be added later as an optional assistive feature.</p></div>
      </div></section>
    </>
  );
}

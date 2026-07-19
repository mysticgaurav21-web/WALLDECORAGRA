"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { products } from "@/data/products";

const categories = ["Botanical", "Geometric", "Marble", "Floral", "Nature", "Abstract", "Kids", "Spiritual"];
const rooms = ["Living Room", "Bedroom", "Kids Room", "Office", "Pooja Room"];

export default function WallpapersPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [room, setRoom] = useState<string[]>([]);
  const [sort, setSort] = useState("featured");

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesSearch = !query || [product.name, product.sku, product.category, product.material, ...product.style].join(" ").toLowerCase().includes(query);
      const matchesCategory = category.length === 0 || category.includes(product.category);
      const matchesRoom = room.length === 0 || room.some((entry) => product.room.includes(entry));
      return matchesSearch && matchesCategory && matchesRoom;
    });
    return [...filtered].sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : sort === "rating" ? b.rating - a.rating : 0);
  }, [search, category, room, sort]);

  const toggle = (value: string, list: string[], setter: (next: string[]) => void) => setter(list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value]);
  return (
    <>
      <section className="page-hero"><div className="container"><div className="breadcrumbs"><span>Home</span><span>/</span><span>Wallpapers</span></div><span className="eyebrow">Ready roll collection</span><h1>Wallpaper for every kind of space.</h1><p>Explore premium rolls with clear specifications, accurate quantity calculation and installation support.</p></div></section>
      <section className="section"><div className="container catalogue-layout">
        <aside className="filter-panel">
          <div className="filter-group"><h4>Category</h4>{categories.map((item) => <label key={item}><input type="checkbox" checked={category.includes(item)} onChange={() => toggle(item, category, setCategory)} />{item}</label>)}</div>
          <div className="filter-group"><h4>Room</h4>{rooms.map((item) => <label key={item}><input type="checkbox" checked={room.includes(item)} onChange={() => toggle(item, room, setRoom)} />{item}</label>)}</div>
          <div className="filter-group"><button className="button button-outline full" onClick={() => { setCategory([]); setRoom([]); setSearch(""); }}>Clear filters</button></div>
        </aside>
        <div>
          <div className="catalogue-tools"><div className="search-box"><Icon name="search" size={19} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, code or style" aria-label="Search wallpapers" /></div><button className="button button-outline mobile-filter-button"><Icon name="filter" size={18} /> Filters</button><select className="select" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="rating">Highest Rated</option></select></div>
          <p className="result-count">Showing {visible.length} of {products.length} wallpapers</p>
          <div className="product-grid">{visible.length ? visible.map((product) => <ProductCard key={product.id} product={product} />) : <div className="empty-state"><Icon name="search" size={40} /><h3>No matching wallpaper found</h3><p>Try another product name, code, room or category.</p></div>}</div>
        </div>
      </div></section>
    </>
  );
}

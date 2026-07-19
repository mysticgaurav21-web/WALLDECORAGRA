"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { formatINR } from "@/lib/calculations";

const nav = ["Overview", "Products", "Custom Designs", "Orders", "Quotations", "Customers", "Installation", "Analytics", "Settings"];
const orders = [
  { id: "WD-260719-041", customer: "Aarav Sharma", type: "Custom mural", amount: 17882, status: "Design Review" },
  { id: "WD-260719-040", customer: "Meera Gupta", type: "Ready rolls", amount: 9178, status: "Paid" },
  { id: "WD-260718-039", customer: "The Fern Cafe", type: "Commercial", amount: 48260, status: "Production" },
  { id: "WD-260718-038", customer: "Kabir Singh", type: "Ready rolls", amount: 6389, status: "Dispatched" },
];

export default function AdminPage() {
  const [active, setActive] = useState("Overview");
  return <section className="section"><div className="container"><div className="admin-shell">
    <aside className="admin-sidebar"><div className="brand light"><span className="brand-mark">WD</span><span>WallDecor<span>99</span></span></div><nav className="admin-nav">{nav.map((item) => <button className={active === item ? "active" : ""} onClick={() => setActive(item)} key={item}>{item}</button>)}</nav></aside>
    <div className="admin-main">
      <div className="admin-top"><div><h1>{active}</h1><p>Production dashboard starter with role-based routes planned for Supabase Auth.</p></div><button className="button button-primary"><Icon name="plus" size={18} /> Add product</button></div>
      <div className="metrics-grid"><div className="metric-card"><span>Revenue this month</span><strong>₹4.82L</strong><small>↑ 18.4% from last month</small></div><div className="metric-card"><span>Active orders</span><strong>46</strong><small>12 require attention</small></div><div className="metric-card"><span>Pending quotations</span><strong>19</strong><small>7 expiring this week</small></div><div className="metric-card"><span>Custom design requests</span><strong>13</strong><small>5 awaiting customer approval</small></div></div>
      <div className="admin-grid">
        <div className="admin-card"><div className="admin-card-head"><h3>Recent orders</h3><button className="button button-outline" style={{ minHeight: 38 }}>View all</button></div><table className="data-table"><thead><tr><th>Order</th><th>Customer</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><b>{order.id}</b></td><td>{order.customer}</td><td>{order.type}</td><td>{formatINR(order.amount)}</td><td><span className="status-pill">{order.status}</span></td></tr>)}</tbody></table></div>
        <div className="admin-card"><div className="admin-card-head"><h3>Sales by category</h3><span className="eyebrow">July</span></div><div className="bar-list">{[["Ready Rolls",72],["Custom Murals",58],["Installation",34],["Samples",18]].map(([name,value]) => <div className="bar-row" key={name}><div><span>{name}</span><b>{value}%</b></div><div className="bar-track"><div className="bar-fill" style={{ width: `${value}%` }} /></div></div>)}</div></div>
        <div className="admin-card"><div className="admin-card-head"><h3>Action queue</h3></div><table className="data-table"><tbody><tr><td>Low stock products</td><td><b>6</b></td><td><span className="status-pill">Review</span></td></tr><tr><td>Image quality warnings</td><td><b>4</b></td><td><span className="status-pill">Designer</span></td></tr><tr><td>Installation requests</td><td><b>9</b></td><td><span className="status-pill">Assign</span></td></tr><tr><td>Abandoned carts</td><td><b>23</b></td><td><span className="status-pill">Follow up</span></td></tr></tbody></table></div>
        <div className="admin-card"><div className="admin-card-head"><h3>Conversion funnel</h3></div><div className="bar-list">{[["Product views",100],["Calculator completed",61],["WhatsApp enquiry",42],["Quotation sent",29],["Order placed",18]].map(([name,value]) => <div className="bar-row" key={name}><div><span>{name}</span><b>{value}%</b></div><div className="bar-track"><div className="bar-fill" style={{ width: `${value}%` }} /></div></div>)}</div></div>
      </div>
    </div>
  </div></div></section>;
}

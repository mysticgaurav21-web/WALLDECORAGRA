"use client";
import { Icon } from "@/components/icons";
export function PrintButton() { return <button className="button button-primary" onClick={() => window.print()}><Icon name="download" size={18} /> Download / Print PDF</button>; }

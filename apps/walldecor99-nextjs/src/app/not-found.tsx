import Link from "next/link";
import { Icon } from "@/components/icons";
export default function NotFound() { return <section className="section"><div className="narrow empty-cart"><Icon name="search" size={50}/><h1 style={{fontSize:54}}>Page not found</h1><p>The wallpaper or page you requested may have moved.</p><Link className="button button-primary" href="/">Return home</Link></div></section>; }

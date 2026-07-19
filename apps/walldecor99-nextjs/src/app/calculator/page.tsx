import { RollCalculator } from "@/components/roll-calculator";

export const metadata = { title: "Wallpaper Roll Calculator" };

export default function CalculatorPage() {
  return <><section className="page-hero"><div className="container"><div className="breadcrumbs"><span>Home</span><span>/</span><span>Roll Calculator</span></div><span className="eyebrow">Plan with confidence</span><h1>Calculate the right number of rolls.</h1><p>Enter wall and opening measurements. The estimate considers vertical drops, pattern repeat and a safety margin—not only square-foot area.</p></div></section><section className="section"><div className="container"><RollCalculator /></div></section></>;
}

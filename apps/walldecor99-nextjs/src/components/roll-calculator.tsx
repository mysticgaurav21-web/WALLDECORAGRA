"use client";

import { useMemo, useState } from "react";
import { calculateRolls, formatINR } from "@/lib/calculations";
import { createWhatsAppUrl } from "@/lib/whatsapp";
import { Icon } from "@/components/icons";

export function RollCalculator({ defaultPrice = 2199, compact = false }: { defaultPrice?: number; compact?: boolean }) {
  const [form, setForm] = useState({ wallWidthFt: 12, wallHeightFt: 10, numberOfWalls: 1, excludedAreaSqFt: 0, rollWidthFt: 1.73, rollLengthFt: 32.8, patternRepeatIn: 21, wastagePercent: 10, pricePerRoll: defaultPrice, installationPerSqFt: 25, includeInstallation: false });
  const result = useMemo(() => calculateRolls(form), [form]);
  const update = (key: keyof typeof form, value: number | boolean) => setForm((current) => ({ ...current, [key]: value }));
  const message = `WallDecor99 Roll Calculation\nWall: ${form.wallWidthFt} ft × ${form.wallHeightFt} ft (${form.numberOfWalls} wall)\nNet area: ${result.netAreaSqFt} sq ft\nRecommended rolls: ${result.recommendedRolls}\nEstimated total incl. GST: ${formatINR(result.total)}\nInstallation: ${form.includeInstallation ? "Required" : "Not selected"}`;
  return (
    <div className={`calculator-shell ${compact ? "compact" : ""}`}>
      <div className="calculator-form">
        <div className="form-grid">
          <label><span>Wall width (ft)</span><input type="number" min="1" value={form.wallWidthFt} onChange={(e) => update("wallWidthFt", Number(e.target.value))} /></label>
          <label><span>Wall height (ft)</span><input type="number" min="1" value={form.wallHeightFt} onChange={(e) => update("wallHeightFt", Number(e.target.value))} /></label>
          <label><span>Number of walls</span><input type="number" min="1" value={form.numberOfWalls} onChange={(e) => update("numberOfWalls", Number(e.target.value))} /></label>
          <label><span>Doors/windows area (sq ft)</span><input type="number" min="0" value={form.excludedAreaSqFt} onChange={(e) => update("excludedAreaSqFt", Number(e.target.value))} /></label>
          {!compact && <><label><span>Roll width (ft)</span><input type="number" step="0.01" value={form.rollWidthFt} onChange={(e) => update("rollWidthFt", Number(e.target.value))} /></label><label><span>Roll length (ft)</span><input type="number" step="0.1" value={form.rollLengthFt} onChange={(e) => update("rollLengthFt", Number(e.target.value))} /></label><label><span>Pattern repeat (in)</span><input type="number" value={form.patternRepeatIn} onChange={(e) => update("patternRepeatIn", Number(e.target.value))} /></label><label><span>Safety margin (%)</span><input type="number" min="0" max="30" value={form.wastagePercent} onChange={(e) => update("wastagePercent", Number(e.target.value))} /></label></>}
        </div>
        <label className="check-row"><input type="checkbox" checked={form.includeInstallation} onChange={(e) => update("includeInstallation", e.target.checked)} /><span><strong>Add professional installation</strong><small>Estimated at ₹{form.installationPerSqFt}/sq ft</small></span></label>
      </div>
      <div className="calculator-result">
        <span className="eyebrow">Your estimate</span>
        <div className="roll-count"><strong>{result.recommendedRolls}</strong><span>recommended rolls</span></div>
        <div className="result-list"><div><span>Net wallpaper area</span><b>{result.netAreaSqFt} sq ft</b></div><div><span>Total drops</span><b>{result.totalDrops}</b></div><div><span>Drops per roll</span><b>{result.dropsPerRoll}</b></div><div><span>Estimated wastage</span><b>{result.estimatedWastageSqFt} sq ft</b></div><div><span>Wallpaper cost</span><b>{formatINR(result.productCost)}</b></div>{form.includeInstallation && <div><span>Installation</span><b>{formatINR(result.installationCost)}</b></div>}<div><span>GST (18%)</span><b>{formatINR(result.gst)}</b></div></div>
        <div className="estimate-total"><span>Estimated total</span><strong>{formatINR(result.total)}</strong></div>
        <a className="button whatsapp-button full" href={createWhatsAppUrl(message)} target="_blank" rel="noreferrer"><Icon name="whatsapp" /> Send estimate on WhatsApp</a>
        <p className="disclaimer">Final quantity may vary with wall condition, pattern alignment and installer assessment.</p>
      </div>
    </div>
  );
}

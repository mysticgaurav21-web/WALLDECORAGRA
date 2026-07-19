import type { RollCalculationInput, RollCalculationResult } from "@/types";

const round2 = (value: number) => Math.round(value * 100) / 100;

export function calculateRolls(input: RollCalculationInput): RollCalculationResult {
  const positive = (value: number, fallback = 0) => Number.isFinite(value) && value > 0 ? value : fallback;
  const wallWidthFt = positive(input.wallWidthFt);
  const wallHeightFt = positive(input.wallHeightFt);
  const numberOfWalls = Math.max(1, Math.floor(positive(input.numberOfWalls, 1)));
  const rollWidthFt = positive(input.rollWidthFt, 1.73);
  const rollLengthFt = positive(input.rollLengthFt, 32.8);
  const excludedAreaSqFt = Math.max(0, input.excludedAreaSqFt || 0);
  const wastagePercent = Math.min(30, Math.max(0, input.wastagePercent || 0));
  const repeatFt = Math.max(0, input.patternRepeatIn || 0) / 12;

  const grossAreaSqFt = wallWidthFt * wallHeightFt * numberOfWalls;
  const netAreaSqFt = Math.max(0, grossAreaSqFt - excludedAreaSqFt);
  const adjustedDropLengthFt = repeatFt > 0
    ? Math.ceil(wallHeightFt / repeatFt) * repeatFt
    : wallHeightFt;
  const dropsPerWall = Math.ceil(wallWidthFt / rollWidthFt);
  const totalDrops = dropsPerWall * numberOfWalls;
  const dropsPerRoll = Math.max(1, Math.floor(rollLengthFt / adjustedDropLengthFt));
  const minimumRolls = Math.max(1, Math.ceil(totalDrops / dropsPerRoll));
  const safetyAdjustedDrops = Math.ceil(totalDrops * (1 + wastagePercent / 100));
  const recommendedRolls = Math.max(minimumRolls, Math.ceil(safetyAdjustedDrops / dropsPerRoll));
  const purchasedCoverage = recommendedRolls * rollWidthFt * rollLengthFt;
  const estimatedWastageSqFt = Math.max(0, purchasedCoverage - netAreaSqFt);
  const productCost = recommendedRolls * Math.max(0, input.pricePerRoll || 0);
  const installationCost = input.includeInstallation
    ? netAreaSqFt * Math.max(0, input.installationPerSqFt || 0)
    : 0;
  const subtotal = productCost + installationCost;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return {
    grossAreaSqFt: round2(grossAreaSqFt),
    netAreaSqFt: round2(netAreaSqFt),
    adjustedDropLengthFt: round2(adjustedDropLengthFt),
    totalDrops,
    dropsPerRoll,
    minimumRolls,
    recommendedRolls,
    estimatedWastageSqFt: round2(estimatedWastageSqFt),
    productCost: round2(productCost),
    installationCost: round2(installationCost),
    subtotal: round2(subtotal),
    gst: round2(gst),
    total: round2(total),
  };
}

export function calculateImageQuality(
  widthPx: number,
  heightPx: number,
  targetWidthFt: number,
  targetHeightFt: number,
) {
  const targetWidthIn = targetWidthFt * 12;
  const targetHeightIn = targetHeightFt * 12;
  const dpi = Math.floor(Math.min(widthPx / targetWidthIn, heightPx / targetHeightIn));
  let label = "Not Recommended";
  let note = "Visible pixelation is highly likely at full wall size.";
  if (dpi >= 150) {
    label = "Excellent";
    note = "Suitable for detailed, close-view printing.";
  } else if (dpi >= 100) {
    label = "Good";
    note = "Suitable for most wallpaper applications.";
  } else if (dpi >= 72) {
    label = "Acceptable";
    note = "Best viewed from a normal room distance.";
  } else if (dpi >= 45) {
    label = "Low Quality";
    note = "Designer review or image enhancement is recommended.";
  }
  return { dpi: Math.max(0, dpi), label, note };
}

export function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

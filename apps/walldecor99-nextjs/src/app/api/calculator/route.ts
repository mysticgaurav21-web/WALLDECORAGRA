import { NextResponse } from "next/server";
import { calculateRolls } from "@/lib/calculations";
import type { RollCalculationInput } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<RollCalculationInput>;
    const required = [body.wallWidthFt, body.wallHeightFt, body.numberOfWalls, body.rollWidthFt, body.rollLengthFt];
    if (required.some((value) => typeof value !== "number" || value <= 0)) {
      return NextResponse.json({ error: "Valid positive wall and roll dimensions are required." }, { status: 400 });
    }
    const result = calculateRolls({
      wallWidthFt: body.wallWidthFt!, wallHeightFt: body.wallHeightFt!, numberOfWalls: body.numberOfWalls!, excludedAreaSqFt: body.excludedAreaSqFt || 0,
      rollWidthFt: body.rollWidthFt!, rollLengthFt: body.rollLengthFt!, patternRepeatIn: body.patternRepeatIn || 0, wastagePercent: body.wastagePercent ?? 10,
      pricePerRoll: body.pricePerRoll || 0, installationPerSqFt: body.installationPerSqFt || 0, includeInstallation: Boolean(body.includeInstallation),
    });
    return NextResponse.json({ data: result });
  } catch {
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
  }
}

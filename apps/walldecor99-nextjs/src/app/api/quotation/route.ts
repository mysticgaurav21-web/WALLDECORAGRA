import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const customerName = typeof body.customerName === "string" ? body.customerName.trim() : "";
    if (!customerName) return NextResponse.json({ error: "Customer name is required." }, { status: 400 });
    const quotationNumber = `WDQ-${new Date().toISOString().slice(2,10).replaceAll("-", "")}-${Math.floor(100 + Math.random() * 900)}`;
    return NextResponse.json({ data: { quotationNumber, status: "draft", createdAt: new Date().toISOString(), pricingSnapshot: body.pricingSnapshot || null } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid quotation request." }, { status: 400 });
  }
}

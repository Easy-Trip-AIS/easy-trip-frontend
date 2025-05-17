// app/api/geocode/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      console.error("❌ Відсутня адреса в запиті.");
      return NextResponse.json({ error: "Missing address parameter" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    console.log("🔍 Requested address:", address);
    console.log("🔑 API key (перевірка наявності):", apiKey ? "[OK]" : "[MISSING]");

    if (!apiKey) {
      return NextResponse.json({ error: "Missing Google Maps API key" }, { status: 500 });
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    console.log("🌐 Запит до Google Maps URL:", url);

    const response = await fetch(url);
    const data = await response.json();

    console.log("📦 Google Maps API response:", JSON.stringify(data, null, 2));

    if (data.status !== "OK" || !data.results.length) {
      return NextResponse.json({
        error: "Geocoding failed",
        details: data,
      }, { status: 400 });
    }

    const location = data.results[0].geometry.location;
    return NextResponse.json(location);
  } catch (error) {
    console.error("🔥 Геокодування завершилось помилкою:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

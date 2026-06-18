import { NextResponse } from "next/server";
import { fetchHistoricalPrices } from "@/lib/coingecko";
import { simulate } from "@/lib/dca";
import type { Frequency } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const coinId = searchParams.get("coinId");
  const amount = parseFloat(searchParams.get("amount") || "0");
  const frequency = (searchParams.get("frequency") || "weekly") as Frequency;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!coinId || !amount || !startDate || !endDate) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  }

  // CoinGecko free tier: granularity depends on range
  // > 90 days => daily data (good for us)
  try {
    const rawPrices = await fetchHistoricalPrices(coinId, start, end);
    if (!rawPrices.length) {
      return NextResponse.json({ error: "No price data available" }, { status: 404 });
    }
    const result = simulate(rawPrices, amount, frequency, start, end);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

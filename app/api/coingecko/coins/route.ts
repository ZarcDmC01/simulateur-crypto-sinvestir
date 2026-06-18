import { NextResponse } from "next/server";
import { fetchTopCryptos, searchCryptos } from "@/lib/coingecko";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  try {
    const coins = query ? await searchCryptos(query) : await fetchTopCryptos();
    return NextResponse.json(coins);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

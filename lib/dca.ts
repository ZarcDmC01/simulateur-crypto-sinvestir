import type { Frequency, DataPoint, SimulationResult } from "./types";

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

// Build a map of date -> price from raw CoinGecko data
function buildPriceMap(raw: [number, number][]): Map<string, number> {
  const map = new Map<string, number>();
  for (const [ts, price] of raw) {
    const date = toDateStr(new Date(ts));
    // Keep last price for a given date
    map.set(date, price);
  }
  return map;
}

// Find nearest available price (look forward up to 7 days)
function getPrice(map: Map<string, number>, date: Date): number | null {
  for (let i = 0; i <= 7; i++) {
    const d = addDays(date, i);
    const price = map.get(toDateStr(d));
    if (price !== undefined) return price;
  }
  return null;
}

export function simulate(
  rawPrices: [number, number][],
  amount: number,
  frequency: Frequency,
  startDate: Date,
  endDate: Date
): SimulationResult {
  const priceMap = buildPriceMap(rawPrices);

  // Build investment schedule
  const investDates: Date[] = [];
  if (frequency === "one-shot") {
    investDates.push(new Date(startDate));
  } else {
    let current = new Date(startDate);
    while (current <= endDate) {
      investDates.push(new Date(current));
      if (frequency === "daily") current = addDays(current, 1);
      else if (frequency === "weekly") current = addDays(current, 7);
      else if (frequency === "monthly") current = addMonths(current, 1);
    }
  }

  // Run simulation
  let totalInvested = 0;
  let totalAcquired = 0;
  let weightedPriceSum = 0;

  const purchases: { date: Date; qty: number; price: number }[] = [];

  for (const date of investDates) {
    const price = getPrice(priceMap, date);
    if (price === null) continue;
    const qty = amount / price;
    totalInvested += amount;
    totalAcquired += qty;
    weightedPriceSum += price * qty;
    purchases.push({ date, qty, price });
  }

  // Build data points for the chart (daily snapshots)
  const dataPoints: DataPoint[] = [];
  const allDates = [...priceMap.keys()].sort();

  let runningInvested = 0;
  let runningAcquired = 0;
  const purchaseIndex = new Map<string, { qty: number; invested: number }>();
  for (const p of purchases) {
    const ds = toDateStr(p.date);
    const prev = purchaseIndex.get(ds) || { qty: 0, invested: 0 };
    purchaseIndex.set(ds, { qty: prev.qty + p.qty, invested: prev.invested + amount });
  }

  for (const dateStr of allDates) {
    const price = priceMap.get(dateStr)!;
    const d = new Date(dateStr);
    if (d < startDate || d > endDate) continue;

    const purchase = purchaseIndex.get(dateStr);
    if (purchase) {
      runningInvested += purchase.invested;
      runningAcquired += purchase.qty;
    }

    if (runningInvested === 0) continue;

    const value = runningAcquired * price;
    dataPoints.push({
      date: dateStr,
      price,
      invested: Math.round(runningInvested * 100) / 100,
      value: Math.round(value * 100) / 100,
      acquired: Math.round(runningAcquired * 1e6) / 1e6,
      gainLoss: Math.round((value - runningInvested) * 100) / 100,
    });
  }

  const lastPrice = dataPoints.length
    ? dataPoints[dataPoints.length - 1].price
    : 0;
  const finalCapital = totalAcquired * lastPrice;
  const performance = totalInvested > 0 ? ((finalCapital - totalInvested) / totalInvested) * 100 : 0;
  const avgBuyPrice = totalAcquired > 0 ? weightedPriceSum / totalAcquired : 0;

  return {
    totalInvested: Math.round(totalInvested * 100) / 100,
    totalAcquired: Math.round(totalAcquired * 1e6) / 1e6,
    avgBuyPrice: Math.round(avgBuyPrice * 100) / 100,
    finalCapital: Math.round(finalCapital * 100) / 100,
    performance: Math.round(performance * 100) / 100,
    dataPoints,
  };
}

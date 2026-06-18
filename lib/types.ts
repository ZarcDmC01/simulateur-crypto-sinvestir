export type Frequency = "one-shot" | "daily" | "weekly" | "monthly";

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  thumb?: string;
}

export interface SimulatorParams {
  assetId: string;
  assetName: string;
  amount: number;
  frequency: Frequency;
  startDate: string;
  endDate: string;
}

export interface DataPoint {
  date: string;
  price: number;
  invested: number;
  value: number;
  acquired: number;
  gainLoss: number;
}

export interface SimulationResult {
  totalInvested: number;
  totalAcquired: number;
  avgBuyPrice: number;
  finalCapital: number;
  performance: number;
  dataPoints: DataPoint[];
}

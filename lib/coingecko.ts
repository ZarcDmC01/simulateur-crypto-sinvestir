import type { CryptoAsset } from "./types";

const BINANCE = "https://api.binance.com/api/v3";

// Static top-50 crypto list with Binance symbols + CoinGecko thumb URLs
const TOP_COINS: CryptoAsset[] = [
  { id: "BTCUSDT",  symbol: "BTC",  name: "Bitcoin",          thumb: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png" },
  { id: "ETHUSDT",  symbol: "ETH",  name: "Ethereum",         thumb: "https://assets.coingecko.com/coins/images/279/thumb/ethereum.png" },
  { id: "BNBUSDT",  symbol: "BNB",  name: "BNB",              thumb: "https://assets.coingecko.com/coins/images/825/thumb/bnb-icon2_2x.png" },
  { id: "SOLUSDT",  symbol: "SOL",  name: "Solana",           thumb: "https://assets.coingecko.com/coins/images/4128/thumb/solana.png" },
  { id: "XRPUSDT",  symbol: "XRP",  name: "XRP",              thumb: "https://assets.coingecko.com/coins/images/44/thumb/xrp-symbol-white-128.png" },
  { id: "DOGEUSDT", symbol: "DOGE", name: "Dogecoin",         thumb: "https://assets.coingecko.com/coins/images/5/thumb/dogecoin.png" },
  { id: "ADAUSDT",  symbol: "ADA",  name: "Cardano",          thumb: "https://assets.coingecko.com/coins/images/975/thumb/cardano.png" },
  { id: "AVAXUSDT", symbol: "AVAX", name: "Avalanche",        thumb: "https://assets.coingecko.com/coins/images/12559/thumb/Avalanche_Circle_RedWhite_Trans.png" },
  { id: "DOTUSDT",  symbol: "DOT",  name: "Polkadot",         thumb: "https://assets.coingecko.com/coins/images/12171/thumb/polkadot.png" },
  { id: "LINKUSDT", symbol: "LINK", name: "Chainlink",        thumb: "https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png" },
  { id: "LTCUSDT",  symbol: "LTC",  name: "Litecoin",         thumb: "https://assets.coingecko.com/coins/images/2/thumb/litecoin.png" },
  { id: "MATICUSDT",symbol: "MATIC",name: "Polygon",          thumb: "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png" },
  { id: "UNIUSDT",  symbol: "UNI",  name: "Uniswap",          thumb: "https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png" },
  { id: "ATOMUSDT", symbol: "ATOM", name: "Cosmos",           thumb: "https://assets.coingecko.com/coins/images/1481/thumb/cosmos_hub.png" },
  { id: "XLMUSDT",  symbol: "XLM",  name: "Stellar",          thumb: "https://assets.coingecko.com/coins/images/100/thumb/Stellar_symbol_black_RGB.png" },
  { id: "ETCUSDT",  symbol: "ETC",  name: "Ethereum Classic", thumb: "https://assets.coingecko.com/coins/images/453/thumb/ethereum-classic-logo.png" },
  { id: "NEARUSDT", symbol: "NEAR", name: "NEAR Protocol",    thumb: "https://assets.coingecko.com/coins/images/10365/thumb/near.jpg" },
  { id: "ALGOUSDT", symbol: "ALGO", name: "Algorand",         thumb: "https://assets.coingecko.com/coins/images/4380/thumb/download.png" },
  { id: "FTMUSDT",  symbol: "FTM",  name: "Fantom",           thumb: "https://assets.coingecko.com/coins/images/4001/thumb/Fantom_round.png" },
  { id: "SANDUSDT", symbol: "SAND", name: "The Sandbox",      thumb: "https://assets.coingecko.com/coins/images/12129/thumb/sandbox_logo.jpg" },
  { id: "MANAUSDT", symbol: "MANA", name: "Decentraland",     thumb: "https://assets.coingecko.com/coins/images/878/thumb/decentraland-mana.png" },
  { id: "APTUSDT",  symbol: "APT",  name: "Aptos",            thumb: "https://assets.coingecko.com/coins/images/26455/thumb/aptos_round.png" },
  { id: "ARBUSDT",  symbol: "ARB",  name: "Arbitrum",         thumb: "https://assets.coingecko.com/coins/images/16547/thumb/photo_2023-03-29_21.47.00.jpeg" },
  { id: "OPUSDT",   symbol: "OP",   name: "Optimism",         thumb: "https://assets.coingecko.com/coins/images/25244/thumb/Optimism.png" },
  { id: "INJUSDT",  symbol: "INJ",  name: "Injective",        thumb: "https://assets.coingecko.com/coins/images/12882/thumb/Secondary_Symbol.png" },
  { id: "SUIUSDT",  symbol: "SUI",  name: "Sui",              thumb: "https://assets.coingecko.com/coins/images/26375/thumb/sui_asset.jpeg" },
  { id: "SEIUSDT",  symbol: "SEI",  name: "Sei",              thumb: "https://assets.coingecko.com/coins/images/28205/thumb/Sei_Logo_-_Transparent.png" },
  { id: "TONUSDT",  symbol: "TON",  name: "Toncoin",          thumb: "https://assets.coingecko.com/coins/images/17980/thumb/ton_symbol.png" },
  { id: "TRXUSDT",  symbol: "TRX",  name: "TRON",             thumb: "https://assets.coingecko.com/coins/images/1094/thumb/tron-logo.png" },
  { id: "VETUSDT",  symbol: "VET",  name: "VeChain",          thumb: "https://assets.coingecko.com/coins/images/1167/thumb/VET_Token_Icon.png" },
];

export async function fetchTopCryptos(): Promise<CryptoAsset[]> {
  return TOP_COINS;
}

export async function searchCryptos(query: string): Promise<CryptoAsset[]> {
  const q = query.toLowerCase();
  return TOP_COINS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.symbol.toLowerCase().includes(q)
  );
}

// EUR/USD rate via Binance EURUSDT
async function getEurUsdRate(): Promise<number> {
  try {
    const res = await fetch(`${BINANCE}/ticker/price?symbol=EURUSDT`, {
      cache: "no-store",
    });
    if (!res.ok) return 0.93;
    const d = await res.json();
    return parseFloat(d.price) || 0.93;
  } catch {
    return 0.93;
  }
}

// Historical daily prices [timestamp_ms, price_eur][]
export async function fetchHistoricalPrices(
  symbol: string, // e.g. "BTCUSDT"
  from: Date,
  to: Date
): Promise<[number, number][]> {
  const eurRate = await getEurUsdRate();
  const allPrices: [number, number][] = [];

  // Binance returns max 1000 candles per request — paginate if needed
  let startTime = from.getTime();
  const endTime = to.getTime();

  while (startTime < endTime) {
    const url = `${BINANCE}/klines?symbol=${symbol}&interval=1d&startTime=${startTime}&endTime=${endTime}&limit=1000`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Binance API error: ${res.status} — ${body.substring(0, 100)}`);
    }
    const candles = await res.json();
    if (!candles.length) break;

    for (const c of candles) {
      const ts: number = c[0]; // open time
      const close: number = parseFloat(c[4]); // close price in USD
      allPrices.push([ts, close * eurRate]);
    }

    // Next batch starts after the last candle
    const lastTs: number = candles[candles.length - 1][6]; // close time
    if (lastTs >= endTime) break;
    startTime = lastTs + 1;
    if (candles.length < 1000) break;
  }

  if (!allPrices.length) {
    throw new Error("Aucune donnée disponible pour cet actif sur cette période.");
  }

  return allPrices;
}

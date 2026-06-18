"use client";

import { useState, useCallback } from "react";
import type { CryptoAsset, SimulationResult, Frequency } from "@/lib/types";
import CryptoSearch from "./CryptoSearch";
import KPICard from "./KPICard";
import HistoryChart from "./HistoryChart";
import GainsChart from "./GainsChart";

interface Props {
  topCoins: CryptoAsset[];
}

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: "one-shot", label: "En une fois" },
  { value: "daily", label: "Par jour" },
  { value: "weekly", label: "Par semaine" },
  { value: "monthly", label: "Par mois" },
];

function formatEur(n: number, decimals = 2) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

function formatNum(n: number, decimals = 6) {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(n);
}

function formatPct(n: number) {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)} %`;
}

// Icons
const IconPiggy = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);
const IconCoins = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="8" cy="8" r="5" /><circle cx="16" cy="16" r="5" />
  </svg>
);
const IconTag = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);
const IconWallet = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);
const IconTrend = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default function SimulatorClient({ topCoins }: Props) {
  const [asset, setAsset] = useState<CryptoAsset | null>(null);
  const [amount, setAmount] = useState("100");
  const [frequency, setFrequency] = useState<Frequency>("weekly");
  const [startDate, setStartDate] = useState("2020-01-01");
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = useCallback(async () => {
    if (!asset) { setError("Choisissez un actif."); return; }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError("Montant invalide."); return; }
    if (!startDate || !endDate || startDate >= endDate) {
      setError("Dates invalides."); return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/coingecko/simulate?coinId=${asset.id}&amount=${amt}&frequency=${frequency}&startDate=${startDate}&endDate=${endDate}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [asset, amount, frequency, startDate, endDate]);

  const perfAccent = result
    ? result.performance >= 0 ? "positive" : "negative"
    : "neutral";

  return (
    <div className="w-full">
      {/* Top: Form + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Form */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-[#0049C6] text-white text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Simulation
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                Actif numérique
              </label>
              <CryptoSearch value={asset} onChange={setAsset} topCoins={topCoins} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Montant (€)
                </label>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 focus:border-[#0049C6]/60 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Fréquence
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as Frequency)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 focus:border-[#0049C6]/60 focus:outline-none transition-colors"
                  style={{ backgroundColor: "#0F1E40" }}
                >
                  {FREQUENCIES.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Depuis
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 focus:border-[#0049C6]/60 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  {"Jusqu'au"}
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/90 focus:border-[#0049C6]/60 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleSimulate}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#0049C6] hover:bg-[#1a5fd4] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Calcul en cours…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Simuler
                </>
              )}
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-[#0049C6] text-white text-sm font-semibold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Chiffres clés
          </div>
          <div className="p-5 grid grid-cols-1 gap-3">
            <KPICard
              label="Investi"
              value={result ? formatEur(result.totalInvested) : null}
              icon={<IconPiggy />}
            />
            <KPICard
              label="Acquis"
              value={result ? `${formatNum(result.totalAcquired)} ${asset?.symbol ?? ""}` : null}
              icon={<IconCoins />}
            />
            <KPICard
              label="Prix moyen d'acquisition"
              value={result ? formatEur(result.avgBuyPrice) : null}
              icon={<IconTag />}
            />
            <KPICard
              label="Capital final"
              value={result ? formatEur(result.finalCapital) : null}
              icon={<IconWallet />}
              accent={result ? (result.finalCapital >= result.totalInvested ? "positive" : "negative") : "neutral"}
            />
            <KPICard
              label="Performance"
              value={result ? formatPct(result.performance) : null}
              icon={<IconTrend />}
              accent={perfAccent}
            />
          </div>
        </div>
      </div>

      {/* Chart: Historique */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden mb-4">
        <div className="flex items-center gap-2 px-5 py-3 bg-[#0049C6] text-white text-sm font-semibold">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Historique
        </div>
        <div className="p-5">
          <HistoryChart data={result?.dataPoints ?? []} />
        </div>
      </div>

      {/* Chart: Gains / Pertes */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 bg-[#0049C6] text-white text-sm font-semibold">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Gains / Pertes
        </div>
        <div className="p-5">
          <GainsChart data={result?.dataPoints ?? []} />
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-6 text-white/25 text-xs text-center leading-relaxed">
        Les simulations sont basées sur des données historiques et ne constituent pas un conseil en investissement.
        Les performances passées ne préjugent pas des performances futures.
      </p>
    </div>
  );
}

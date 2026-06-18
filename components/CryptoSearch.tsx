"use client";

import { useState, useEffect, useRef } from "react";
import type { CryptoAsset } from "@/lib/types";

interface Props {
  value: CryptoAsset | null;
  onChange: (asset: CryptoAsset) => void;
  topCoins: CryptoAsset[];
}

export default function CryptoSearch({ value, onChange, topCoins }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CryptoAsset[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Default list when no search
  const displayList = query.length < 2 ? topCoins.slice(0, 30) : results;

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/coingecko/coins?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(asset: CryptoAsset) {
    onChange(asset);
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#0049C6]/60 transition-colors text-left"
      >
        {value ? (
          <>
            {value.thumb && (
              <img src={value.thumb} alt={value.name} className="w-5 h-5 rounded-full" />
            )}
            <span className="text-white/90 font-medium">{value.name}</span>
            <span className="text-white/40 text-sm ml-1">{value.symbol}</span>
          </>
        ) : (
          <span className="text-white/40">Choisir un actif…</span>
        )}
        <svg
          className={`ml-auto w-4 h-4 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl bg-[#0B1530] border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-white/10">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher Bitcoin, Ethereum…"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/90 placeholder-white/30 text-sm outline-none focus:border-[#0049C6]/60"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {loading && (
              <li className="px-4 py-3 text-white/40 text-sm">Recherche…</li>
            )}
            {!loading && displayList.length === 0 && (
              <li className="px-4 py-3 text-white/40 text-sm">Aucun résultat</li>
            )}
            {!loading && displayList.map((asset) => (
              <li key={asset.id}>
                <button
                  type="button"
                  onClick={() => select(asset)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
                >
                  {asset.thumb && (
                    <img src={asset.thumb} alt={asset.name} className="w-5 h-5 rounded-full flex-shrink-0" />
                  )}
                  <span className="text-white/90 text-sm font-medium">{asset.name}</span>
                  <span className="text-white/40 text-xs ml-auto">{asset.symbol}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

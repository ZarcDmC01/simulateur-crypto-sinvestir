import { fetchTopCryptos } from "@/lib/coingecko";
import SimulatorClient from "@/components/SimulatorClient";
import type { CryptoAsset } from "@/lib/types";

export default async function Home() {
  let topCoins: CryptoAsset[] = [];
  try {
    topCoins = await fetchTopCryptos();
  } catch {
    // Fallback: empty list, user can still search
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#030C24]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#0049C6] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="font-semibold text-white/90 text-sm tracking-tight">
              S&apos;investir <span className="text-white/40 font-normal">/ Simulateurs</span>
            </span>
          </div>
          <a
            href="https://simulateurs.sinvestir.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/40 hover:text-white/70 transition-colors hidden sm:block"
          >
            Voir tous les simulateurs →
          </a>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 40% at 50% -10%, rgba(0,73,198,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-8 relative">
          <div className="mb-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0049C6]/15 border border-[#0049C6]/30 text-[#7aa3e8] text-xs font-medium">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Données historiques réelles
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-white leading-tight" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            Simulateur Crypto-monnaie
          </h1>
          <p className="mt-2 text-white/50 text-sm max-w-xl">
            Simulez vos investissements en DCA ou one-shot sur Bitcoin, Ethereum et +7 000 cryptomonnaies,
            à partir de données de marché historiques réelles.
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 pb-12">
        <SimulatorClient topCoins={topCoins} />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
          <span>© {new Date().getFullYear()} S&apos;investir — Tous droits réservés</span>
          <span>Données : CoinGecko API • Aucun conseil en investissement</span>
        </div>
      </footer>
    </div>
  );
}

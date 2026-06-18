"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import type { DataPoint } from "@/lib/types";

interface Props {
  data: DataPoint[];
}

function formatEur(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    signDisplay: "always",
  }).format(n);
}

function formatDate(str: string) {
  const d = new Date(str);
  return d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const isPos = val >= 0;
  return (
    <div className="bg-[#0B1530] border border-white/10 rounded-xl p-3 shadow-xl text-sm">
      <p className="text-white/50 mb-1 text-xs">{label}</p>
      <p className={`font-semibold ${isPos ? "text-emerald-400" : "text-red-400"}`}>
        {formatEur(val)}
      </p>
    </div>
  );
};

export default function GainsChart({ data }: Props) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-64 text-white/30 text-sm">
      Lancez une simulation pour voir le graphique
    </div>
  );

  const sampled = data.length > 200
    ? data.filter((_, i) => i % Math.ceil(data.length / 200) === 0)
    : data;

  const maxAbs = Math.max(...sampled.map((d) => Math.abs(d.gainLoss)), 1);
  const hasPositive = sampled.some((d) => d.gainLoss >= 0);
  const hasNegative = sampled.some((d) => d.gainLoss < 0);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={sampled} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v) => formatEur(v)}
          tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={90}
          domain={[-maxAbs * 1.1, maxAbs * 1.1]}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 2" />
        {hasPositive && (
          <Area
            type="monotone"
            dataKey="gainLoss"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#gainGrad)"
            dot={false}
            activeDot={{ r: 4 }}
            baseValue={0}
          />
        )}
        {hasNegative && (
          <Area
            type="monotone"
            dataKey="gainLoss"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#lossGrad)"
            dot={false}
            activeDot={{ r: 4 }}
            baseValue={0}
          />
        )}
        {!hasPositive && !hasNegative && (
          <Area
            type="monotone"
            dataKey="gainLoss"
            stroke="#0049C6"
            strokeWidth={2}
            fill="rgba(0,73,198,0.1)"
            dot={false}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}

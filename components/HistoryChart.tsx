"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { DataPoint } from "@/lib/types";

interface Props {
  data: DataPoint[];
}

function formatEur(n: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

function formatDate(str: string) {
  const d = new Date(str);
  return d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0B1530] border border-white/10 rounded-xl p-3 shadow-xl text-sm">
      <p className="text-white/50 mb-2 text-xs">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name} : {formatEur(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function HistoryChart({ data }: Props) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-64 text-white/30 text-sm">
      Lancez une simulation pour voir le graphique
    </div>
  );

  // Sample data to max 200 points for performance
  const sampled = data.length > 200
    ? data.filter((_, i) => i % Math.ceil(data.length / 200) === 0)
    : data;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={sampled} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
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
          width={80}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 12, paddingTop: 12 }}
        />
        <Line
          type="monotone"
          dataKey="value"
          name="Valeur"
          stroke="#0049C6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#0049C6" }}
        />
        <Line
          type="monotone"
          dataKey="invested"
          name="Investi"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth={1.5}
          strokeDasharray="5 3"
          dot={false}
          activeDot={{ r: 3, fill: "#fff" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

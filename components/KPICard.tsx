interface Props {
  label: string;
  value: string | null;
  icon: React.ReactNode;
  accent?: "positive" | "negative" | "neutral";
}

export default function KPICard({ label, value, icon, accent = "neutral" }: Props) {
  const accentClass =
    accent === "positive"
      ? "text-emerald-400"
      : accent === "negative"
      ? "text-red-400"
      : "text-white/90";

  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-colors">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#0049C6]/15 flex items-center justify-center text-[#0049C6]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-white/50 text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className={`text-lg font-semibold mt-0.5 ${accentClass}`}>
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

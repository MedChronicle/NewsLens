import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import { ANALYTICS_DATA } from "../data";
import { T } from "../theme";

const TIP: React.CSSProperties = {
  backgroundColor: T.card,
  border: `1px solid ${T.border}`,
  borderRadius: 8,
  fontSize: 11,
  fontFamily: "'JetBrains Mono', monospace",
  color: T.text,
  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
};

function KPICard({ label, value, sub, delta, color }: { label: string; value: string | number; sub: string; delta?: string; color: string }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 6, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: color, opacity: 0.7, borderRadius: "14px 14px 0 0" }} />
      <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: T.textMuted, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0, fontWeight: 600 }}>{label}</p>
      <p style={{ fontFamily: "Fraunces,serif", fontSize: 34, fontWeight: 900, color: T.text, margin: 0, lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {delta && <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: delta.startsWith("+") ? T.green : T.red, fontWeight: 600 }}>{delta}</span>}
        <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: T.textMuted }}>{sub}</span>
      </div>
    </div>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: T.textMuted, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 14px", fontWeight: 600 }}>{title}</p>
  );
}

function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 20px", ...style }}>
      {children}
    </div>
  );
}

function WordCloud({ words }: { words: typeof ANALYTICS_DATA.trendingKeywords }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "center", padding: "8px 0", minHeight: 140 }}>
      {words.map((w) => (
        <span key={w.word} style={{ fontSize: `${w.size * 0.55}px`, color: w.color, fontFamily: "Fraunces,serif", fontWeight: 700, cursor: "pointer", opacity: 0.85, transition: "opacity 0.15s, transform 0.15s", letterSpacing: "-0.01em", userSelect: "none" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
          {w.word}
        </span>
      ))}
    </div>
  );
}

export default function Analytics() {
  const { sentimentDistribution, categoryBreakdown, sourceBreakdown, articlesPerDay, trendingKeywords } = ANALYTICS_DATA;

  return (
    <div style={{ flex: 1, overflowY: "auto", background: T.bg, padding: "24px 28px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontFamily: "Fraunces,serif", fontSize: 26, fontWeight: 900, color: T.text, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Analytics</h1>
            <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.textMuted, margin: 0 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · 47 active sources
            </p>
          </div>
          <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 10, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.green, fontWeight: 600 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, animation: "blink 1.5s ease-in-out infinite" }} />
            LIVE DATA
          </span>
        </div>

        {/* KPI Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          <KPICard label="Articles Today" value="1,284" sub="vs yesterday" delta="+12.4%" color={T.indigo} />
          <KPICard label="Active Sources" value="47" sub="2 sources offline" color={T.green} />
          <KPICard label="Trending Topics" value="23" sub="8 new in last hour" delta="+8" color={T.purple} />
          <KPICard label="Avg Sentiment" value="62%" sub="Positive bias today" delta="+3pts" color={T.amber} />
        </div>

        {/* Row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 14 }}>
          <Panel>
            <SectionHead title="Sentiment Split" />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <PieChart width={200} height={170}>
                <Pie data={sentimentDistribution} cx={100} cy={85} innerRadius={50} outerRadius={76} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {sentimentDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, ""]} contentStyle={TIP} />
              </PieChart>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", marginTop: 4 }}>
                {sentimentDistribution.map((s) => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                      <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: T.textSub }}>{s.name}</span>
                    </div>
                    <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 11, color: T.text, fontWeight: 600 }}>{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel>
            <SectionHead title="Stories by Category" />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryBreakdown} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                <XAxis dataKey="category" tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fill: T.textMuted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fill: T.textMuted }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={TIP} cursor={{ fill: T.borderSub }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {categoryBreakdown.map((_, i) => {
                    const cols = [T.indigo, T.purple, T.green, T.amber, T.sky, T.red, "#fb923c", "#f472b6"];
                    return <Cell key={i} fill={cols[i % cols.length]} fillOpacity={0.85} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        {/* Area chart */}
        <Panel>
          <SectionHead title="Articles per Day · Sentiment Breakdown" />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={articlesPerDay} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="ag-pos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.green} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={T.green} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ag-neu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.textSub} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={T.textSub} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ag-neg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={T.red} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={T.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fill: T.textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fill: T.textMuted }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TIP} cursor={{ stroke: T.border }} />
              <Legend wrapperStyle={{ fontSize: "10px", fontFamily: "'JetBrains Mono', monospace", color: T.textSub }} />
              <Area type="monotone" dataKey="positive" name="Positive" stroke={T.green} fill="url(#ag-pos)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="neutral"  name="Neutral"  stroke={T.textSub} fill="url(#ag-neu)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="negative" name="Negative" stroke={T.red}    fill="url(#ag-neg)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        {/* Row 4 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Panel>
            <SectionHead title="Coverage by Source" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {sourceBreakdown.map((s, i) => {
                const pct = Math.round((s.count / 1284) * 100);
                const cols = [T.indigo, T.purple, T.green, T.amber, T.sky, T.red, "#fb923c", "#f472b6"];
                const col = cols[i % cols.length];
                return (
                  <div key={s.source} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: T.textSub, width: 80, flexShrink: 0, fontWeight: 500 }}>{s.source}</span>
                    <div style={{ flex: 1, height: 5, background: T.card, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 4, opacity: 0.8, transition: "width 0.8s ease" }} />
                    </div>
                    <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.textMuted, width: 34, textAlign: "right", flexShrink: 0 }}>{s.count}</span>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel>
            <SectionHead title="Trending Keywords" />
            <WordCloud words={trendingKeywords} />
          </Panel>
        </div>

        {/* Bottom metrics strip */}
        <Panel style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0, padding: 0 }}>
          {[
            { label: "Avg Read Time", value: "4.2m" },
            { label: "Breaking News", value: "12" },
            { label: "API Calls Today", value: "847" },
            { label: "Sources Live", value: "45/47" },
            { label: "Last Refresh", value: "4m ago" },
          ].map((m, i) => (
            <div key={m.label} style={{ padding: "16px 20px", borderRight: i < 4 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: T.textMuted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontFamily: "Fraunces,serif", fontSize: 22, fontWeight: 900, color: T.text, lineHeight: 1 }}>{m.value}</div>
            </div>
          ))}
        </Panel>

      </div>
    </div>
  );
}

import { useState } from "react";
import { TRENDING_TOPICS } from "../data";
import { T } from "../theme";

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 88;
  const h = 36;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 6) - 3}`).join(" ");
  const id = `sg-${color.replace("#", "")}`;
  return (
    <svg width={w} height={h} style={{ overflow: "visible", display: "block" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${id})`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

const RANK_COLORS = ["#6366f1", "#a855f7", "#f59e0b", "#f43f5e", "#22c55e"];
const SPARK_COLORS = ["#6366f1","#a855f7","#22c55e","#f59e0b","#38bdf8","#f43f5e","#fb923c","#f472b6","#818cf8","#4ade80"];
const CAT_ICONS: Record<string, string> = {
  Technology: "⚡", AI: "🤖", Business: "📈", Sports: "⚽", Science: "🔬",
  World: "🌍", India: "🇮🇳", Entertainment: "🎬",
};

export default function Trending() {
  const [selCat, setSelCat] = useState<string | null>(null);
  const maxMentions = Math.max(...TRENDING_TOPICS.map((t) => t.mentions));

  const cats = Array.from(new Set(TRENDING_TOPICS.map((t) => t.category)));
  const filtered = selCat ? TRENDING_TOPICS.filter((t) => t.category === selCat) : TRENDING_TOPICS;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: T.bg }}>

      {/* Page header */}
      <div style={{ padding: "20px 28px 0", flexShrink: 0, background: T.bgRaised, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h1 style={{ fontFamily: "Fraunces,serif", fontSize: 24, fontWeight: 900, color: T.text, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Trending Topics</h1>
            <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.textMuted, margin: 0 }}>
              Updated every 15 min · {TRENDING_TOPICS.length} topics tracked · {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 9, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.indigo, fontWeight: 600 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.indigo, animation: "blink 2s ease-in-out infinite" }} />
              LIVE TRACKING
            </span>
          </div>
        </div>

        {/* Category filter pills */}
        <div style={{ display: "flex", gap: 6, paddingBottom: 14, overflowX: "auto" }}>
          <button onClick={() => setSelCat(null)} style={{ padding: "5px 14px", borderRadius: 20, background: !selCat ? T.indigo : T.surface, border: `1px solid ${!selCat ? T.indigo : T.border}`, color: !selCat ? "#fff" : T.textSub, fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: !selCat ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}>All</button>
          {cats.map((cat) => {
            const on = selCat === cat;
            const c = T.cat[cat] ?? T.cat.Technology;
            return (
              <button key={cat} onClick={() => setSelCat(on ? null : cat)} style={{ padding: "5px 14px", borderRadius: 20, background: on ? c.bg : T.surface, border: `1px solid ${on ? c.border : T.border}`, color: on ? c.text : T.textSub, fontFamily: "Inter,sans-serif", fontSize: 12, fontWeight: on ? 600 : 400, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}>
                {CAT_ICONS[cat] ?? ""} {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content — scrollable */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

          {/* Topic list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((topic, i) => {
              const globalRank = TRENDING_TOPICS.indexOf(topic);
              const rankColor = RANK_COLORS[globalRank] ?? T.textMuted;
              const sparkColor = SPARK_COLORS[globalRank % SPARK_COLORS.length];
              const pct = (topic.mentions / maxMentions) * 100;
              const c = T.cat[topic.category] ?? T.cat.Technology;
              return (
                <div key={topic.id} className="fade-in"
                  style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 20px", display: "flex", gap: 16, cursor: "pointer", transition: "border-color 0.15s, box-shadow 0.15s", alignItems: "center" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}>

                  {/* Rank */}
                  <div style={{ width: 44, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <span style={{ fontFamily: "Fraunces,serif", fontSize: 28, fontWeight: 900, color: rankColor, lineHeight: 1 }}>{globalRank + 1}</span>
                    <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 8, color: T.textMuted, letterSpacing: "0.1em" }}>RANK</span>
                  </div>

                  {/* Main */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontFamily: "Fraunces,serif", fontSize: 16, fontWeight: 700, color: T.text, letterSpacing: "-0.01em" }}>{topic.name}</span>
                      <span style={{ padding: "2px 8px", borderRadius: 6, background: c.bg, border: `1px solid ${c.border}`, color: c.text, fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                        {CAT_ICONS[topic.category] ?? ""} {topic.category}
                      </span>
                    </div>

                    {/* Mention bar */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ flex: 1, height: 5, background: T.card, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: sparkColor, borderRadius: 4, opacity: 0.8, transition: "width 0.8s ease" }} />
                      </div>
                      <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 11, color: T.textSub, fontWeight: 600, flexShrink: 0 }}>{fmt(topic.mentions)} mentions</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.green, fontWeight: 600 }}>↑ +{topic.change}% in 24h</span>
                      <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.textMuted }}>7-day trend →</span>
                    </div>
                  </div>

                  {/* Sparkline */}
                  <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <Sparkline data={topic.sparkline} color={sparkColor} />
                    <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: T.textMuted, letterSpacing: "0.08em" }}>7 DAYS</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 0 }}>

            {/* Top 5 heat */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 20px" }}>
              <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: T.textMuted, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 14px", fontWeight: 600 }}>Top 5 Heat Map</p>
              {TRENDING_TOPICS.slice(0, 5).map((t, i) => {
                const heat = (t.mentions / maxMentions) * 100;
                const col = RANK_COLORS[i];
                return (
                  <div key={t.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: T.textSub }}>{t.name}</span>
                      <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: col }}>{Math.round(heat)}%</span>
                    </div>
                    <div style={{ height: 5, background: T.card, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${heat}%`, background: col, borderRadius: 4, opacity: 0.75 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: "18px 20px" }}>
              <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: T.textMuted, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 14px", fontWeight: 600 }}>Session Stats</p>
              {[
                { label: "Topics Tracked", value: TRENDING_TOPICS.length },
                { label: "Total Mentions", value: fmt(TRENDING_TOPICS.reduce((a, t) => a + t.mentions, 0)) },
                { label: "Fastest Rising", value: TRENDING_TOPICS.sort((a, b) => b.change - a.change)[0]?.name ?? "—" },
                { label: "Top Category", value: "Technology" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "8px 0", borderBottom: `1px solid ${T.borderSub}` }}>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: T.textMuted }}>{s.label}</span>
                  <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 11, color: T.text, fontWeight: 600, textAlign: "right", maxWidth: "55%" }}>{String(s.value)}</span>
                </div>
              ))}
            </div>

            {/* Methodology note */}
            <div style={{ background: T.indigoSub, border: `1px solid ${T.indigoBorder}`, borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: T.indigo, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 8px", fontWeight: 600 }}>Methodology</p>
              <p style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: T.textSub, lineHeight: 1.7, margin: 0 }}>
                Trending score is calculated from mention frequency across 47 sources, weighted by source authority and normalized for publishing volume. Refreshes every 15 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

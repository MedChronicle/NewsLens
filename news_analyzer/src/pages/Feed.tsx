import { useState, useEffect, useCallback, useRef } from "react";
import { ARTICLES, CATEGORIES, type Article, type Category } from "../data";
import { SkeletonCard } from "../components/Skeleton";
import BookmarkButton from "../components/BookmarkButton";
import { useApp } from "../context/AppContext";
import { fetchHeadlines, transformNewsApiArticle } from "../services/newsApi";
import { T } from "../theme";

function timeAgo(iso: string) {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function CatBadge({ cat }: { cat: string }) {
  const c = T.cat[cat] ?? T.cat.Technology;
  return (
    <span style={{ padding: "2px 8px", borderRadius: 6, background: c.bg, border: `1px solid ${c.border}`, color: c.text, fontFamily: "Inter,sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {cat}
    </span>
  );
}

function SentBadge({ s, score }: { s: string; score: number }) {
  const c = T.sent[s] ?? T.sent.neutral;
  return (
    <span style={{ padding: "2px 8px", borderRadius: 6, background: c.bg, color: c.color, fontFamily: "JetBrains Mono,monospace", fontSize: 10, fontWeight: 600, whiteSpace: "nowrap" }}>
      {c.icon} {Math.round(score * 100)}%
    </span>
  );
}

function SourceChip({ source }: { source: string }) {
  const initials = source.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 18, height: 18, borderRadius: 5, background: T.indigoSub, border: `1px solid ${T.indigoBorder}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "JetBrains Mono,monospace", fontSize: 7, color: T.indigo, fontWeight: 700, flexShrink: 0 }}>{initials}</span>
      <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: T.textSub, fontWeight: 500 }}>{source}</span>
    </span>
  );
}

function FeaturedCard({ article, onSelect }: { article: Article; onSelect: (id: string) => void }) {
  const [exp, setExp] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const [hov, setHov] = useState(false);

  return (
    <div className="fade-in" onClick={() => onSelect(article.id)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: T.surface, border: `1px solid ${hov ? T.indigoBorder : T.border}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", boxShadow: hov ? "0 12px 40px rgba(99,102,241,0.15)" : "0 2px 12px rgba(0,0,0,0.3)", transform: hov ? "translateY(-3px)" : "translateY(0)" }}>
      <div style={{ position: "relative", height: 190, background: T.card, flexShrink: 0, overflow: "hidden" }}>
        {!imgErr
          ? <img src={article.thumbnail} alt={article.headline} onError={() => setImgErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hov ? "scale(1.05)" : "scale(1)", transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
          : <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg,${T.surface},${T.card})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke={T.textMuted} strokeWidth={1.2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
        }
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(17,18,36,0.98) 0%,rgba(17,18,36,0.5) 45%,transparent 100%)" }} />
        {article.isBreaking && (
          <div style={{ position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 5, background: T.red, borderRadius: 7, padding: "3px 9px", boxShadow: "0 2px 8px rgba(244,63,94,0.4)" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff", animation: "blink 0.9s ease-in-out infinite" }} />
            <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: "#fff", fontWeight: 700, letterSpacing: "0.15em" }}>BREAKING</span>
          </div>
        )}
        <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
          <CatBadge cat={article.category} />
          <SentBadge s={article.sentiment} score={article.sentimentScore} />
        </div>
      </div>
      <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 700, color: T.text, lineHeight: 1.45, margin: 0, letterSpacing: "-0.01em" }} className="line-clamp-2">
          {article.headline}
        </h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SourceChip source={article.source} />
            <span style={{ color: T.borderSub }}>·</span>
            <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.textMuted }}>{timeAgo(article.publishedAt)}</span>
            <span style={{ color: T.borderSub }}>·</span>
            <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.textMuted }}>{article.readTime}m</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button onClick={(e) => { e.stopPropagation(); setExp((v) => !v); }}
              style={{ background: exp ? T.indigoSub : "transparent", border: `1px solid ${exp ? T.indigoBorder : T.border}`, borderRadius: 7, padding: "3px 10px", fontFamily: "Inter,sans-serif", fontSize: 11, color: exp ? T.indigo : T.textMuted, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.indigoBorder; e.currentTarget.style.color = T.indigo; }}
              onMouseLeave={(e) => { if (!exp) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; } }}>
              ⚡ {exp ? "Hide" : "AI Summary"}
            </button>
            <div onClick={(e) => e.stopPropagation()}><BookmarkButton articleId={article.id} /></div>
          </div>
        </div>
        {exp && (
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
            {article.summary.slice(0, 4).map((pt, i) => (
              <div key={i} style={{ display: "flex", gap: 10, fontSize: 12, color: T.textSub, lineHeight: 1.6 }}>
                <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.indigo, flexShrink: 0, marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                {pt}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ListCard({ article, idx, onSelect }: { article: Article; idx: number; onSelect: (id: string) => void }) {
  const [exp, setExp] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="fade-in" onClick={() => onSelect(article.id)}
      style={{ display: "flex", cursor: "pointer", borderBottom: `1px solid ${T.borderSub}`, transition: "background 0.12s" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = T.surfaceHover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
      <div style={{ width: 44, flexShrink: 0, display: "flex", alignItems: "flex-start", paddingTop: 16, paddingLeft: 16, paddingBottom: 14 }}>
        <span style={{ fontFamily: "Fraunces,serif", fontSize: 20, fontWeight: 900, color: T.borderSub, lineHeight: 1, userSelect: "none" }}>{String(idx + 1).padStart(2, "0")}</span>
      </div>
      <div style={{ width: 76, height: 68, flexShrink: 0, borderRadius: 10, background: T.card, overflow: "hidden", alignSelf: "center" }}>
        {!imgErr
          ? <img src={article.thumbnail} alt="" onError={() => setImgErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          : <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg,${T.surface},${T.card})` }} />
        }
      </div>
      <div style={{ flex: 1, minWidth: 0, padding: "14px 14px 14px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
          <CatBadge cat={article.category} />
          <SentBadge s={article.sentiment} score={article.sentimentScore} />
          {article.isBreaking && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: T.red, fontWeight: 700, letterSpacing: "0.1em" }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: T.red, animation: "blink 1s ease-in-out infinite", display: "inline-block" }} />LIVE
            </span>
          )}
        </div>
        <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 13, fontWeight: 700, color: T.text, lineHeight: 1.45, margin: "0 0 7px", letterSpacing: "-0.01em" }} className="line-clamp-2">
          {article.headline}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <SourceChip source={article.source} />
          <span style={{ color: T.borderSub, fontSize: 12 }}>·</span>
          <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.textMuted }}>{timeAgo(article.publishedAt)}</span>
          <span style={{ color: T.borderSub, fontSize: 12 }}>·</span>
          <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.textMuted }}>{article.readTime}m</span>
          <button onClick={(e) => { e.stopPropagation(); setExp((v) => !v); }}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Inter,sans-serif", fontSize: 11, color: exp ? T.indigo : T.textMuted, padding: 0, transition: "color 0.15s" }}>
            {exp ? "▲ hide" : "▼ summary"}
          </button>
        </div>
        {exp && (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.borderSub}`, display: "flex", flexDirection: "column", gap: 5 }}>
            {article.summary.slice(0, 3).map((pt, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: T.textSub, lineHeight: 1.5 }}>
                <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.indigo, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>{pt}
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0, padding: "14px 14px 14px 0", alignSelf: "flex-start" }} onClick={(e) => e.stopPropagation()}>
        <BookmarkButton articleId={article.id} />
      </div>
    </div>
  );
}

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: "16px 14px", borderBottom: `1px solid ${T.borderSub}` }}>
      <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: T.textMuted, letterSpacing: "0.22em", textTransform: "uppercase", margin: "0 0 10px", fontWeight: 600 }}>{title}</p>
      {children}
    </div>
  );
}

export default function Feed({ onSelectArticle }: { onSelectArticle: (id: string) => void }) {
  const { setApiStatus } = useApp();
  const [selCat, setSelCat] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  const [loading, setLoading] = useState(false);
  const [live, setLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pg, setPg] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [sentFilter, setSentFilter] = useState<"all" | "positive" | "neutral" | "negative">("all");
  const loadedRef = useRef(false);

  const loadLive = useCallback(async (cat?: Category, p = 1) => {
    setLoading(true);
    if (p === 1) setApiStatus("checking");
    setError(null);
    try {
      const data = await fetchHeadlines(cat, 20, p);
      const items = data.articles
        .filter((a) => a.title && a.title !== "[Removed]")
        .map((a, i) => transformNewsApiArticle(a, (p - 1) * 20 + i));
      if (p === 1) {
        setArticles(items.length > 0 ? items : ARTICLES);
        setLive(items.length > 0);
        setTotal(data.totalResults);
        setApiStatus(items.length > 0 ? "valid" : "unconfigured");
      } else {
        setArticles((prev) => [...prev, ...items]);
      }
      setHasMore(data.totalResults > p * 20);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed";
      setError(`Showing curated articles — live feed unavailable (${msg}).`);
      setArticles(ARTICLES);
      setLive(false);
      setApiStatus("unconfigured");
    } finally {
      setLoading(false);
    }
  }, [setApiStatus]);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    loadLive(undefined, 1);
  }, [loadLive]);

  useEffect(() => {
    if (!loadedRef.current) return;
    loadLive(selCat ?? undefined, 1);
    setPg(1);
  }, [selCat, loadLive]);

  const filtered = articles.filter((a) => {
    if (selCat && a.category !== selCat) return false;
    if (q && !a.headline.toLowerCase().includes(q.toLowerCase()) && !a.source.toLowerCase().includes(q.toLowerCase())) return false;
    if (sentFilter !== "all" && a.sentiment !== sentFilter) return false;
    return true;
  });

  const featured = filtered.slice(0, 3);
  const rest = filtered.slice(3);
  const posC = articles.filter((a) => a.sentiment === "positive").length;
  const neuC = articles.filter((a) => a.sentiment === "neutral").length;
  const negC = articles.filter((a) => a.sentiment === "negative").length;

  const sentOpts: { id: "all" | "positive" | "neutral" | "negative"; label: string; count: number }[] = [
    { id: "all",      label: "All Stories", count: articles.length },
    { id: "positive", label: "Positive",    count: posC },
    { id: "neutral",  label: "Neutral",     count: neuC },
    { id: "negative", label: "Negative",    count: negC },
  ];

  return (
    <div style={{ display: "flex", height: "100%", background: T.bg }}>

      {/* LEFT SIDEBAR */}
      <aside style={{ width: 210, flexShrink: 0, borderRight: `1px solid ${T.border}`, overflowY: "auto", background: T.bgRaised, display: "flex", flexDirection: "column" }}>
        <SideSection title="Live Stats">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ background: T.surface, borderRadius: 10, padding: "12px", border: `1px solid ${T.border}` }}>
              <div style={{ fontFamily: "Fraunces,serif", fontSize: 26, fontWeight: 900, color: T.text, lineHeight: 1 }}>{loading ? "—" : filtered.length}</div>
              <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 8, color: T.textMuted, marginTop: 3, letterSpacing: "0.12em", textTransform: "uppercase" }}>Articles</div>
            </div>
            <div style={{ background: live ? "rgba(34,197,94,0.08)" : T.surface, borderRadius: 10, padding: "12px", border: `1px solid ${live ? "rgba(34,197,94,0.2)" : T.border}` }}>
              <div style={{ fontFamily: "Fraunces,serif", fontSize: 26, fontWeight: 900, color: live ? T.green : T.textMuted, lineHeight: 1 }}>{live ? "●" : "○"}</div>
              <div style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 8, color: live ? T.green : T.textMuted, marginTop: 3, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.8 }}>{live ? "Live" : "Curated"}</div>
            </div>
          </div>
          {live && total > 0 && <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: T.textMuted, margin: "8px 0 0" }}>{total.toLocaleString()} total results</p>}
        </SideSection>

        <SideSection title="Sentiment">
          {sentOpts.map((opt) => {
            const cfg = opt.id === "all" ? null : T.sent[opt.id];
            const on = sentFilter === opt.id;
            return (
              <button key={opt.id} onClick={() => setSentFilter(opt.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: on ? (opt.id === "all" ? T.indigoSub : cfg!.bg) : "transparent", border: `1px solid ${on ? (opt.id === "all" ? T.indigoBorder : cfg!.color + "33") : "transparent"}`, borderRadius: 8, padding: "6px 9px", marginBottom: 3, cursor: "pointer", transition: "all 0.12s" }}
                onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = T.surface; }}
                onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = "transparent"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 13, color: opt.id === "all" ? T.indigo : cfg!.color, lineHeight: 1 }}>{opt.id === "all" ? "∑" : cfg!.icon}</span>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: on ? T.text : T.textSub, fontWeight: on ? 600 : 400 }}>{opt.label}</span>
                </div>
                <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.textMuted }}>{opt.count}</span>
              </button>
            );
          })}
        </SideSection>

        <SideSection title="Sections">
          <button onClick={() => setSelCat(null)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: !selCat ? T.indigoSub : "transparent", border: `1px solid ${!selCat ? T.indigoBorder : "transparent"}`, borderRadius: 8, padding: "6px 9px", marginBottom: 3, cursor: "pointer" }}
            onMouseEnter={(e) => { if (selCat) e.currentTarget.style.background = T.surface; }}
            onMouseLeave={(e) => { if (selCat) e.currentTarget.style.background = "transparent"; }}>
            <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: !selCat ? T.indigo : T.textSub, fontWeight: !selCat ? 600 : 400 }}>All Sections</span>
            <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.textMuted }}>{articles.length}</span>
          </button>
          {CATEGORIES.map((cat) => {
            const c = T.cat[cat] ?? T.cat.Technology;
            const on = selCat === cat;
            const cnt = articles.filter((a) => a.category === cat).length;
            return (
              <button key={cat} onClick={() => setSelCat(cat)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", background: on ? c.bg : "transparent", border: `1px solid ${on ? c.border : "transparent"}`, borderRadius: 8, padding: "6px 9px", marginBottom: 3, cursor: "pointer", transition: "all 0.12s" }}
                onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = T.surface; }}
                onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = "transparent"; }}>
                <span style={{ fontFamily: "Inter,sans-serif", fontSize: 12, color: on ? c.text : T.textSub, fontWeight: on ? 600 : 400 }}>{cat}</span>
                <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.textMuted }}>{cnt}</span>
              </button>
            );
          })}
        </SideSection>

        <SideSection title="Sources">
          {["Reuters", "BBC News", "Bloomberg", "TechCrunch", "NDTV", "Al Jazeera", "The Guardian"].map((src) => (
            <div key={src} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: live ? T.green : T.textMuted, flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: T.textSub }}>{src}</span>
            </div>
          ))}
        </SideSection>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflowY: "auto", background: T.bg, display: "flex", flexDirection: "column" }}>
        {/* Toolbar */}
        <div style={{ padding: "10px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0, background: T.bgRaised, position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: T.textMuted, pointerEvents: "none" }} width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search headlines, sources…" value={q} onChange={(e) => setQ(e.target.value)}
              style={{ width: "100%", paddingLeft: 34, paddingRight: 14, paddingTop: 8, paddingBottom: 8, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, color: T.text, fontFamily: "Inter,sans-serif", fontSize: 13, outline: "none", transition: "border-color 0.15s" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = T.indigoBorder; e.currentTarget.style.boxShadow = `0 0 0 3px ${T.indigoSub}`; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }} />
          </div>
          {live
            ? <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 10, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.green, fontWeight: 600, whiteSpace: "nowrap" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, animation: "blink 1.5s ease-in-out infinite" }} />NEWSAPI · LIVE
              </span>
            : <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 10, background: T.surface, border: `1px solid ${T.border}`, fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.textMuted, whiteSpace: "nowrap" }}>CURATED</span>
          }
          {loading && <div style={{ width: 16, height: 16, border: `2px solid ${T.border}`, borderTopColor: T.indigo, borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />}
          <button onClick={() => { loadedRef.current = true; loadLive(selCat ?? undefined, 1); setPg(1); }}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, color: T.textSub, fontFamily: "Inter,sans-serif", fontSize: 12, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.indigoBorder; e.currentTarget.style.color = T.indigo; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSub; }}>
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Refresh
          </button>
        </div>

        {/* API errors are handled silently — curated articles shown as fallback */}

        {loading && articles.length === 0 ? (
          <div style={{ padding: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 14 }}>
              {[1, 2, 3].map((i) => <SkeletonCard key={i} featured />)}
            </div>
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: T.surface, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke={T.textMuted} strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <p style={{ fontFamily: "Inter,sans-serif", fontSize: 14, color: T.textSub }}>No articles match your filters</p>
          </div>
        ) : (
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.textMuted, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>Top Stories</span>
                  {live && <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: T.green }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: T.green, animation: "blink 1.5s infinite" }} />LIVE</span>}
                </div>
                <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.textMuted }}>{new Date().toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {featured.map((a) => <FeaturedCard key={a.id} article={a} onSelect={onSelectArticle} />)}
              </div>
            </div>

            {rest.length > 0 && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.textMuted, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>More Stories</span>
                  <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: T.textMuted }}>{rest.length} articles</span>
                </div>
                <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
                  {rest.map((a, i) => <ListCard key={a.id} article={a} idx={i} onSelect={onSelectArticle} />)}
                </div>
              </div>
            )}

            {live && hasMore && (
              <div style={{ display: "flex", justifyContent: "center", paddingBottom: 8 }}>
                <button onClick={() => { const n = pg + 1; setPg(n); loadLive(selCat ?? undefined, n); }} disabled={loading}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 28px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, color: T.textSub, fontFamily: "Inter,sans-serif", fontSize: 13, cursor: loading ? "not-allowed" : "pointer", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.borderColor = T.indigoBorder; e.currentTarget.style.color = T.indigo; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSub; }}>
                  {loading && <div style={{ width: 14, height: 14, border: `2px solid ${T.border}`, borderTopColor: T.indigo, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />}
                  {loading ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* RIGHT RAIL */}
      <aside style={{ width: 196, flexShrink: 0, borderLeft: `1px solid ${T.border}`, overflowY: "auto", background: T.bgRaised, display: "flex", flexDirection: "column" }}>
        <SideSection title="Trending Now">
          {["GPT-5 Launch", "ISRO Mission", "Fed Rate Decision", "Ukraine Ceasefire", "Apple Vision Pro 2", "Chandrayaan-4", "Bitcoin All-Time High", "WHO Mpox Alert", "SpaceX Starship", "India GDP Growth"].map((w, i) => (
            <div key={w} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "7px 0", borderBottom: `1px solid ${T.borderSub}` }}>
              <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: T.textMuted, width: 16, flexShrink: 0, paddingTop: 1 }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: T.textSub, flex: 1, lineHeight: 1.4 }}>{w}</span>
              <span style={{ fontSize: 9, color: T.green, marginTop: 1, flexShrink: 0 }}>↑</span>
            </div>
          ))}
        </SideSection>

        <SideSection title="Sentiment Mix">
          {(["positive", "neutral", "negative"] as const).map((s) => {
            const cnt = s === "positive" ? posC : s === "neutral" ? neuC : negC;
            const pct = articles.length > 0 ? (cnt / articles.length) * 100 : 0;
            const cfg = T.sent[s];
            return (
              <div key={s} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: "Inter,sans-serif", fontSize: 11, color: T.textSub }}>{cfg.icon} {cfg.label}</span>
                  <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 10, color: cfg.color }}>{Math.round(pct)}%</span>
                </div>
                <div style={{ height: 4, background: T.surface, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: cfg.color, borderRadius: 4, opacity: 0.75, transition: "width 0.8s ease" }} />
                </div>
              </div>
            );
          })}
        </SideSection>

        <SideSection title="Edition">
          <div style={{ background: T.surface, borderRadius: 12, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(99,102,241,0.3)" }}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <span style={{ fontFamily: "Fraunces,serif", fontSize: 13, color: T.text, fontWeight: 700 }}>NewsLens</span>
            </div>
            <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: 9, color: T.textMuted, lineHeight: 1.8, margin: 0 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long" })}<br />
              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}<br />
              English · Global Edition
            </p>
          </div>
        </SideSection>
      </aside>
    </div>
  );
}

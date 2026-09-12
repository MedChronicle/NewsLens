import { useState, useRef, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { T } from "./theme";
import Feed from "./pages/Feed";
import ArticleDetail from "./pages/ArticleDetail";
import Trending from "./pages/Trending";
import Analytics from "./pages/Analytics";
import SearchResults from "./pages/SearchResults";
import Bookmarks from "./pages/Bookmarks";
import Settings from "./pages/Settings";
import ReadingHistory from "./pages/ReadingHistory";
import BreakingTicker from "./components/BreakingTicker";
import MarketStrip from "./components/MarketStrip";
import NotificationsPanel from "./components/NotificationsPanel";
import { ARTICLES } from "./data";

type Page = "feed"|"article"|"trending"|"analytics"|"search"|"bookmarks"|"history"|"settings";

const NAV: {id:Page; label:string; d:string}[] = [
  {id:"feed",      label:"Feed",       d:"M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"},
  {id:"trending",  label:"Trending",   d:"M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"},
  {id:"analytics", label:"Analytics",  d:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"},
  {id:"search",    label:"Search",     d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"},
  {id:"bookmarks", label:"Bookmarks",  d:"M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"},
  {id:"history",   label:"History",    d:"M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"},
];

function Icon({d,size=16}:{d:string;size?:number}) {
  return (
    <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d={d}/>
    </svg>
  );
}

function AppShell() {
  const [page, setPage] = useState<Page>("feed");
  const [selectedArticle, setSelectedArticle] = useState<string|null>(null);
  const [showNotif, setShowNotif] = useState(false);
  const { bookmarks, readingHistory, apiStatus, addToHistory, darkMode, toggleDarkMode } = useApp();
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e:MouseEvent) => { if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleSelectArticle = (id: string) => {
    setSelectedArticle(id);
    setPage("article");
    const a = ARTICLES.find(x => x.id === id);
    if (a) addToHistory({id:a.id, headline:a.headline, source:a.source, category:a.category, thumbnail:a.thumbnail, readAt:new Date().toISOString()});
  };

  const nav = (p: Page) => { setPage(p); setShowNotif(false); if (p !== "article") setSelectedArticle(null); };
  const active = page === "article" ? "feed" : page;
  const isLive = apiStatus === "valid";

  const btn = (style = {}): React.CSSProperties => ({
    background: "none", border: "none", cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center", transition: "all 0.15s", ...style,
  });

  return (
    <div style={{minHeight:"100vh", background:T.bg, color:T.text, display:"flex", flexDirection:"column", fontFamily:"'Inter',system-ui,sans-serif"}}>
      <MarketStrip />

      {/* ── Header ── */}
      <header style={{background:T.bgRaised, borderBottom:`1px solid ${T.border}`, flexShrink:0, position:"sticky", top:28, zIndex:40, backdropFilter:"blur(12px)"}}>
        <div style={{display:"flex", alignItems:"center", height:52, padding:"0 16px", gap:0}}>

          {/* Logo */}
          <button onClick={() => nav("feed")} style={{...btn(), gap:9, marginRight:24, flexShrink:0, padding:"4px 8px", borderRadius:10}}>
            <div style={{width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,#6366f1 0%,#a855f7 100%)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 0 16px rgba(99,102,241,0.4)"}}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </div>
            <span style={{fontFamily:"'Fraunces',serif", fontSize:17, fontWeight:700, color:T.text, letterSpacing:"-0.02em", lineHeight:1}}>NewsLens</span>
          </button>

          {/* Nav */}
          <nav style={{display:"flex", alignItems:"center", gap:2, flex:1, overflowX:"auto"}}>
            {NAV.map(item => {
              const on = active === item.id;
              return (
                <button key={item.id} onClick={() => nav(item.id)} style={{
                  ...btn(),
                  gap:6, padding:"5px 11px", borderRadius:8,
                  background: on ? T.indigoSub : "transparent",
                  border: `1px solid ${on ? T.indigoBorder : "transparent"}`,
                  color: on ? T.indigo : T.textSub,
                  fontSize:13, fontWeight: on ? 600 : 400,
                  whiteSpace:"nowrap", position:"relative",
                }}
                  onMouseEnter={e => { if (!on) { e.currentTarget.style.background=T.surfaceHover; e.currentTarget.style.color=T.text; }}}
                  onMouseLeave={e => { if (!on) { e.currentTarget.style.background="transparent"; e.currentTarget.style.color=T.textSub; }}}
                >
                  <Icon d={item.d} size={14}/>
                  {item.label}
                  {item.id === "bookmarks" && bookmarks.length > 0 && (
                    <span style={{background:T.indigo, color:"#fff", fontSize:9, fontWeight:700, padding:"1px 5px", borderRadius:10, marginLeft:2}}>{bookmarks.length}</span>
                  )}
                  {item.id === "history" && readingHistory.length > 0 && (
                    <span style={{background:T.surface, color:T.textSub, fontSize:9, fontWeight:600, padding:"1px 5px", borderRadius:10, marginLeft:2, border:`1px solid ${T.border}`}}>{Math.min(readingHistory.length,99)}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div style={{display:"flex", alignItems:"center", gap:6, marginLeft:12, flexShrink:0}}>
            {/* Live pill */}
            <button onClick={() => nav("settings")} style={{...btn(), gap:5, padding:"4px 10px", borderRadius:20, background: isLive ? T.greenSub : T.surface, border:`1px solid ${isLive ? "rgba(34,197,94,0.25)" : T.border}`}}>
              <span style={{width:6, height:6, borderRadius:"50%", background: isLive ? T.green : T.textMuted, display:"block", animation: isLive ? "blink 1.8s ease-in-out infinite" : "none"}} />
              <span style={{fontFamily:"JetBrains Mono,monospace", fontSize:10, color: isLive ? T.green : T.textMuted, fontWeight:600, letterSpacing:"0.06em"}}>{isLive ? "LIVE" : "MOCK"}</span>
            </button>

            {/* Notif */}
            <div style={{position:"relative"}} ref={notifRef}>
              <button onClick={() => setShowNotif(v => !v)} style={{...btn(), width:34, height:34, borderRadius:9, border:`1px solid ${T.border}`, color:T.textSub, position:"relative"}}
                onMouseEnter={e => {e.currentTarget.style.background=T.surface; e.currentTarget.style.color=T.text;}}
                onMouseLeave={e => {e.currentTarget.style.background="none"; e.currentTarget.style.color=T.textSub;}}>
                <Icon d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" size={15}/>
                <span style={{position:"absolute", top:3, right:3, width:8, height:8, background:T.red, borderRadius:"50%", border:`2px solid ${T.bgRaised}`}}/>
              </button>
              {showNotif && <NotificationsPanel onClose={() => setShowNotif(false)}/>}
            </div>

            {/* Dark / light toggle */}
            <button onClick={toggleDarkMode} title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              style={{...btn(), width:34, height:34, borderRadius:9, border:`1px solid ${T.border}`, color:T.textSub}}
              onMouseEnter={e => {e.currentTarget.style.background=T.surface; e.currentTarget.style.color=T.text;}}
              onMouseLeave={e => {e.currentTarget.style.background="none"; e.currentTarget.style.color=T.textSub;}}>
              {darkMode
                ? <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 110 14A7 7 0 0112 5z"/></svg>
                : <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              }
            </button>

            {/* Avatar */}
            <div style={{width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0, boxShadow:"0 0 10px rgba(99,102,241,0.3)"}}>R</div>
          </div>
        </div>
        <BreakingTicker />
      </header>

      {/* Content */}
      <div style={{flex:1, display:"flex", overflow:"hidden", height:"calc(100vh - 116px)"}}>
        {page==="feed"      && <Feed onSelectArticle={handleSelectArticle}/>}
        {page==="article"   && selectedArticle && <ArticleDetail articleId={selectedArticle} onBack={() => nav("feed")} onSelectArticle={handleSelectArticle}/>}
        {page==="trending"  && <Trending/>}
        {page==="analytics" && <Analytics/>}
        {page==="search"    && <SearchResults onSelectArticle={handleSelectArticle}/>}
        {page==="bookmarks" && <Bookmarks onSelectArticle={handleSelectArticle}/>}
        {page==="history"   && <ReadingHistory onSelectArticle={handleSelectArticle}/>}
        {page==="settings"  && <Settings/>}
      </div>
    </div>
  );
}

export default function App() {
  return <AppProvider><AppShell/></AppProvider>;
}

import type { Category, Sentiment } from "../data";
import { SOURCE_INITIALS } from "../data";
import { T } from "../theme";

export function CategoryTag({ category }: { category: Category }) {
  const c = T.cat[category] ?? T.cat.Technology;
  return (
    <span style={{padding:"2px 8px", borderRadius:6, background:c.bg, border:`1px solid ${c.border}`, color:c.text, fontFamily:"Inter,sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase", whiteSpace:"nowrap"}}>
      {category}
    </span>
  );
}

export function SentimentBadge({ sentiment, score, compact=false }: { sentiment: Sentiment; score: number; compact?: boolean }) {
  const cfg = T.sent[sentiment] ?? T.sent.neutral;

  if (compact) return (
    <span style={{padding:"2px 8px", borderRadius:6, background:cfg.bg, color:cfg.color, fontFamily:"JetBrains Mono,monospace", fontSize:10, fontWeight:600}}>
      {cfg.icon} {Math.round(score*100)}%
    </span>
  );

  return (
    <div style={{display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#111224", border:"1px solid #1e2040", borderRadius:10}}>
      <span style={{fontSize:16, color:cfg.color, lineHeight:1}}>{cfg.icon}</span>
      <div style={{flex:1}}>
        <div style={{fontFamily:"Inter,sans-serif", fontSize:11, color:cfg.color, fontWeight:600, marginBottom:4}}>{cfg.label}</div>
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <div style={{flex:1, height:4, background:"#1e2040", borderRadius:4, overflow:"hidden"}}>
            <div style={{height:"100%", width:`${score*100}%`, background:cfg.color, borderRadius:4, opacity:0.8}}/>
          </div>
          <span style={{fontFamily:"JetBrains Mono,monospace", fontSize:10, color:cfg.color}}>{Math.round(score*100)}%</span>
        </div>
      </div>
    </div>
  );
}

export function SourceAvatar({ source, size="sm" }: { source: string; size?: "sm"|"md" }) {
  const initials = SOURCE_INITIALS[source] || source.slice(0,2).toUpperCase();
  const d = size === "sm" ? {width:24,height:24,fontSize:9} : {width:32,height:32,fontSize:11};
  return (
    <div style={{...d, background:T.indigoSub, border:`1px solid ${T.indigoBorder}`, borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", color:T.indigo, fontWeight:700, fontFamily:"JetBrains Mono,monospace", flexShrink:0}}>
      {initials}
    </div>
  );
}

export function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{display:"inline-flex", alignItems:"center", gap:6, padding:"4px 10px", background:T.indigoSub, border:`1px solid ${T.indigoBorder}`, borderRadius:20, fontFamily:"Inter,sans-serif", fontSize:11, color:T.indigo, fontWeight:500}}>
      {label}
      <button onClick={onRemove} style={{background:"none", border:"none", color:T.indigo, cursor:"pointer", padding:0, fontSize:14, lineHeight:1, opacity:0.6}}>×</button>
    </span>
  );
}

export function ReadTime({ minutes }: { minutes: number }) {
  return <span style={{fontFamily:"JetBrains Mono,monospace", fontSize:10, color:T.textMuted}}>{minutes}m read</span>;
}

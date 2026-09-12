import { useEffect, useRef } from "react";
import { BREAKING_NEWS } from "../data";

export default function BreakingTicker() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pos = 0, raf: number;
    const go = () => { pos -= 0.42; if (el && Math.abs(pos) >= el.scrollWidth/2) pos=0; if (el) el.style.transform=`translateX(${pos}px)`; raf=requestAnimationFrame(go); };
    raf = requestAnimationFrame(go);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{background:"var(--c-ticker-bg)", borderBottom:"1px solid var(--c-border)", overflow:"hidden", display:"flex", alignItems:"center", height:28, flexShrink:0}}>
      <div style={{flexShrink:0, background:"#f43f5e", color:"#fff", fontSize:9, fontWeight:700, padding:"0 14px", height:"100%", display:"flex", alignItems:"center", letterSpacing:"0.2em", fontFamily:"JetBrains Mono,monospace", gap:6, zIndex:1, whiteSpace:"nowrap"}}>
        <span style={{width:5, height:5, borderRadius:"50%", background:"#fff", animation:"blink 0.9s ease-in-out infinite"}}/>
        BREAKING
      </div>
      <div style={{flex:1, overflow:"hidden", position:"relative"}}>
        <div ref={ref} style={{display:"inline-flex", alignItems:"center", willChange:"transform"}}>
          {[...BREAKING_NEWS,...BREAKING_NEWS].map((item,i) => (
            <span key={i} style={{display:"inline-flex", alignItems:"center"}}>
              <span style={{fontFamily:"Inter,sans-serif", fontSize:11, color:"#c4c8e0", padding:"0 24px", cursor:"pointer", letterSpacing:"0.01em", transition:"color 0.15s", whiteSpace:"nowrap"}}
                onMouseEnter={e => {(e.target as HTMLElement).style.color="#ffffff";}}
                onMouseLeave={e => {(e.target as HTMLElement).style.color="#c4c8e0";}}>
                {item}
              </span>
              <span style={{color:"#1e2040", fontSize:8}}>●</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

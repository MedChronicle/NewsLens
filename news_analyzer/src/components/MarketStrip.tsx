import { useState, useEffect } from "react";

interface Tick { symbol: string; price: number; pct: number; }

const BASE: Tick[] = [
  {symbol:"NIFTY50",  price:24842.6, pct: 0.74},
  {symbol:"SENSEX",   price:81584.3, pct: 0.76},
  {symbol:"S&P 500",  price:5432.2,  pct:-0.52},
  {symbol:"NASDAQ",   price:17183.0, pct:-0.72},
  {symbol:"BTC/USD",  price:185420,  pct: 1.78},
  {symbol:"ETH/USD",  price:3842.5,  pct: 2.24},
  {symbol:"AAPL",     price:229.4,   pct:-0.78},
  {symbol:"NVDA",     price:924.6,   pct: 2.03},
  {symbol:"RELIANCE", price:3124.5,  pct: 1.37},
  {symbol:"TCS",      price:4284.0,  pct:-0.80},
  {symbol:"USD/INR",  price:83.42,   pct: 0.22},
  {symbol:"GOLD",     price:2384.5,  pct: 0.52},
  {symbol:"CRUDE",    price:78.34,   pct:-1.51},
];

function fmt(p: number) {
  if (p > 10000) return p.toLocaleString("en-IN", {maximumFractionDigits:0});
  if (p > 999)   return p.toLocaleString("en-IN", {maximumFractionDigits:1});
  return p.toFixed(2);
}

export default function MarketStrip() {
  const [ticks, setTicks] = useState(BASE);

  useEffect(() => {
    const id = setInterval(() => {
      setTicks(prev => prev.map(t => {
        const d = (Math.random() - 0.495) * t.price * 0.0007;
        return {...t, price: Math.max(0.01, t.price + d), pct: t.pct + (Math.random()-0.5)*0.04};
      }));
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const items = [...ticks, ...ticks];

  return (
    <div style={{background:"var(--c-market-bg)", borderBottom:"1px solid var(--c-market-sep)", overflow:"hidden", display:"flex", alignItems:"center", height:28, flexShrink:0}}>
      <div style={{flexShrink:0, background:"linear-gradient(90deg,#6366f1,#a855f7)", color:"#fff", fontSize:8, fontWeight:700, padding:"0 14px", height:"100%", display:"flex", alignItems:"center", letterSpacing:"0.18em", fontFamily:"JetBrains Mono,monospace", gap:5, whiteSpace:"nowrap"}}>
        ◆ MARKETS
      </div>
      <div style={{flex:1, overflow:"hidden"}}>
        <div style={{display:"inline-flex", alignItems:"center", gap:24, whiteSpace:"nowrap", animation:"marquee 70s linear infinite"}}>
          {items.map((t,i) => (
            <span key={i} style={{display:"inline-flex", alignItems:"center", gap:7}}>
              <span style={{fontFamily:"JetBrains Mono,monospace", fontSize:9, color:"var(--c-market-sym)", letterSpacing:"0.06em"}}>{t.symbol}</span>
              <span style={{fontFamily:"JetBrains Mono,monospace", fontSize:10, color:"var(--c-market-price)"}}>{fmt(t.price)}</span>
              <span style={{fontFamily:"JetBrains Mono,monospace", fontSize:9, color: t.pct >= 0 ? "#22c55e" : "#f43f5e"}}>
                {t.pct >= 0 ? "▲" : "▼"}{Math.abs(t.pct).toFixed(2)}%
              </span>
              <span style={{color:"#12132a", fontSize:8}}>◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

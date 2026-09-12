import { useState } from "react";
import { T } from "../theme";

const INIT = [
  {id:1, title:"Ukraine-Russia ceasefire signed in Istanbul",   time:"2m ago",  unread:true,  tag:"WORLD",    color:"#fb7185"},
  {id:2, title:"GPT-5 trending — 48k mentions in 2 hours",      time:"15m ago", unread:true,  tag:"TECH",     color:"#818cf8"},
  {id:3, title:"Chandrayaan-4 confirms water ice — ISRO live",  time:"28m ago", unread:true,  tag:"SCIENCE",  color:"#7dd3fc"},
  {id:4, title:"Bookmarked topic 'ISRO' has 3 new articles",    time:"1h ago",  unread:false, tag:"BOOKMARK", color:"#c084fc"},
  {id:5, title:"Morning digest ready — 14 top stories today",   time:"6h ago",  unread:false, tag:"DIGEST",   color:"#9da3c8"},
  {id:6, title:"WHO declares Mpox global health emergency",      time:"8h ago",  unread:false, tag:"HEALTH",   color:"#4ade80"},
];

export default function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const [notifs, setNotifs] = useState(INIT);
  const unread = notifs.filter(n => n.unread).length;

  return (
    <div style={{position:"absolute", right:0, top:"calc(100% + 8px)", width:340, background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, boxShadow:"0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)", zIndex:50, overflow:"hidden", animation:"fadeSlideUp 0.2s cubic-bezier(0.16,1,0.3,1)"}}>
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", borderBottom:`1px solid ${T.border}`}}>
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <span style={{fontFamily:"Inter,sans-serif", fontSize:13, color:T.text, fontWeight:600}}>Notifications</span>
          {unread>0 && <span style={{background:T.red, color:"#fff", fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:10}}>{unread}</span>}
        </div>
        <div style={{display:"flex", gap:8}}>
          {unread>0 && <button onClick={()=>setNotifs(p=>p.map(n=>({...n,unread:false})))}
            style={{background:"none",border:"none",cursor:"pointer",fontFamily:"Inter,sans-serif",fontSize:11,color:T.indigo,fontWeight:500}}>Mark all read</button>}
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:T.textMuted,fontSize:18,lineHeight:1,padding:"0 2px"}}>×</button>
        </div>
      </div>

      <div style={{maxHeight:320, overflowY:"auto"}}>
        {notifs.map(n => (
          <div key={n.id} onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,unread:false}:x))}
            style={{display:"flex", gap:12, padding:"12px 16px", borderBottom:`1px solid ${T.borderSub}`, cursor:"pointer", background:n.unread?"rgba(99,102,241,0.04)":"transparent", transition:"background 0.12s"}}
            onMouseEnter={e=>{e.currentTarget.style.background=T.surfaceHover;}}
            onMouseLeave={e=>{e.currentTarget.style.background=n.unread?"rgba(99,102,241,0.04)":"transparent";}}>
            <span style={{flexShrink:0, padding:"2px 6px", borderRadius:6, background:n.color+"18", border:`1px solid ${n.color}30`, fontFamily:"JetBrains Mono,monospace", fontSize:8, color:n.color, fontWeight:700, letterSpacing:"0.08em", alignSelf:"flex-start", marginTop:1, whiteSpace:"nowrap"}}>{n.tag}</span>
            <div style={{flex:1, minWidth:0}}>
              <p style={{fontFamily:"Inter,sans-serif", fontSize:12, color:n.unread?T.text:T.textSub, lineHeight:1.45, margin:"0 0 4px", fontWeight:n.unread?500:400}}>{n.title}</p>
              <p style={{fontFamily:"JetBrains Mono,monospace", fontSize:9, color:T.textMuted, margin:0}}>{n.time}</p>
            </div>
            {n.unread && <div style={{width:7, height:7, borderRadius:"50%", background:T.indigo, flexShrink:0, marginTop:5}}/>}
          </div>
        ))}
      </div>

      <div style={{padding:"10px 16px", borderTop:`1px solid ${T.border}`, background:T.bgRaised}}>
        <p style={{fontFamily:"JetBrains Mono,monospace", fontSize:9, color:T.textMuted, textAlign:"center", margin:0, letterSpacing:"0.15em"}}>UPDATES EVERY 15 MIN</p>
      </div>
    </div>
  );
}

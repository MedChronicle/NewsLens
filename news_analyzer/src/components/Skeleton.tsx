import { T } from "../theme";

export function SkeletonCard({ featured=false }: { featured?: boolean }) {
  const s: React.CSSProperties = {borderRadius:8, background:"linear-gradient(90deg,#12131f 25%,#1c1d2e 50%,#12131f 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.8s ease-in-out infinite"};

  if (featured) return (
    <div style={{background:T.surface, border:`1px solid ${T.border}`, borderRadius:16, overflow:"hidden"}}>
      <div style={{...s, height:190, borderRadius:0}}/>
      <div style={{padding:"14px 16px", display:"flex", flexDirection:"column", gap:10}}>
        <div style={{display:"flex", gap:6}}><div style={{...s,height:20,width:72}}/><div style={{...s,height:20,width:56}}/></div>
        <div style={{...s,height:16,width:"100%"}}/><div style={{...s,height:16,width:"75%"}}/>
        <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{...s,width:18,height:18,borderRadius:5}}/><div style={{...s,height:11,width:80}}/></div>
      </div>
    </div>
  );

  return (
    <div style={{display:"flex", gap:0, borderBottom:`1px solid ${T.borderSub}`, background:T.surface}}>
      <div style={{width:44,padding:"16px 0 14px 16px",flexShrink:0}}><div style={{...s,width:24,height:20,borderRadius:4}}/></div>
      <div style={{width:76,height:68,borderRadius:10,flexShrink:0,alignSelf:"center",overflow:"hidden"}}><div style={{...s,width:"100%",height:"100%",borderRadius:10}}/></div>
      <div style={{flex:1,padding:"14px 14px 14px 12px",display:"flex",flexDirection:"column",gap:7}}>
        <div style={{display:"flex",gap:6}}><div style={{...s,height:18,width:64}}/><div style={{...s,height:18,width:48}}/></div>
        <div style={{...s,height:14,width:"100%"}}/><div style={{...s,height:14,width:"70%"}}/>
        <div style={{...s,height:11,width:110}}/>
      </div>
    </div>
  );
}

export function SkeletonDetail() {
  const s: React.CSSProperties = {borderRadius:8, background:"linear-gradient(90deg,#12131f 25%,#1c1d2e 50%,#12131f 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.8s ease-in-out infinite"};
  return (
    <div style={{maxWidth:800, margin:"0 auto", padding:"32px 24px", display:"flex", flexDirection:"column", gap:14}}>
      <div style={{...s,height:12,width:80}}/>
      <div style={{display:"flex",gap:8}}><div style={{...s,height:22,width:72}}/><div style={{...s,height:22,width:56}}/></div>
      <div style={{...s,height:32,width:"100%"}}/><div style={{...s,height:32,width:"85%"}}/><div style={{...s,height:32,width:"60%"}}/>
      <div style={{...s,height:260,borderRadius:16}}/>
      {[100,92,85,78].map((w,i)=><div key={i} style={{...s,height:13,width:`${w}%`}}/>)}
    </div>
  );
}

export function SkeletonTrending() {
  const s: React.CSSProperties = {borderRadius:8, background:"linear-gradient(90deg,#12131f 25%,#1c1d2e 50%,#12131f 75%)", backgroundSize:"200% 100%", animation:"shimmer 1.8s ease-in-out infinite"};
  return (
    <div>
      {[1,2,3,4,5].map(i=>(
        <div key={i} style={{display:"flex",gap:14,padding:"14px 20px",borderBottom:`1px solid ${T.borderSub}`,alignItems:"center"}}>
          <div style={{...s,width:36,height:36,flexShrink:0}}/>
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:7}}>
            <div style={{...s,height:14,width:"60%"}}/><div style={{...s,height:3,width:"100%"}}/><div style={{...s,height:10,width:"35%"}}/>
          </div>
          <div style={{...s,width:60,height:24,flexShrink:0}}/>
        </div>
      ))}
    </div>
  );
}

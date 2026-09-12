import { useApp } from "../context/AppContext";
import { T } from "../theme";

export default function BookmarkButton({ articleId, size="sm" }: { articleId: string; size?: "sm"|"md" }) {
  const { isBookmarked, toggleBookmark } = useApp();
  const saved = isBookmarked(articleId);
  const dim = size === "sm" ? 30 : 36;

  return (
    <button onClick={e=>{e.stopPropagation(); toggleBookmark(articleId);}} title={saved?"Remove bookmark":"Bookmark"}
      style={{width:dim, height:dim, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.15s", flexShrink:0,
        background: saved ? T.indigoSub : "transparent",
        border: `1px solid ${saved ? T.indigoBorder : T.border}`,
        color: saved ? T.indigo : T.textMuted,
      }}
      onMouseEnter={e=>{if(!saved){e.currentTarget.style.borderColor=T.indigoBorder; e.currentTarget.style.color=T.indigo; e.currentTarget.style.background=T.indigoSub;}}}
      onMouseLeave={e=>{if(!saved){e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.textMuted; e.currentTarget.style.background="transparent";}}}>
      <svg width={size==="sm"?13:16} height={size==="sm"?13:16} fill={saved?"currentColor":"none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
      </svg>
    </button>
  );
}

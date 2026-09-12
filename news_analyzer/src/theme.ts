// All bg/surface/text/border values use CSS custom properties so the
// dark ↔ light mode toggle in index.css takes effect with no component changes.
export const T = {
  bg:           "var(--c-bg)",
  bgRaised:     "var(--c-bg-raised)",
  surface:      "var(--c-surface)",
  surfaceHover: "var(--c-surface-hover)",
  card:         "var(--c-card)",
  cardHover:    "var(--c-card-hover)",
  border:       "var(--c-border)",
  borderSub:    "var(--c-border-sub)",
  text:         "var(--c-text)",
  textSub:      "var(--c-text-sub)",
  textMuted:    "var(--c-text-muted)",
  indigoSub:    "var(--c-indigo-sub)",
  indigoBorder: "var(--c-indigo-border)",
  greenSub:     "var(--c-green-sub)",

  // Accent colors — same in both modes
  indigo:  "#6366f1",
  purple:  "#a855f7",
  red:     "#f43f5e",
  redSub:  "rgba(244,63,94,0.12)",
  green:   "#22c55e",
  amber:   "#f59e0b",
  amberSub:"rgba(245,158,11,0.12)",
  sky:     "#38bdf8",

  cat: {
    Technology:    { bg:"rgba(99,102,241,0.1)",  text:"#818cf8", border:"rgba(99,102,241,0.2)" },
    AI:            { bg:"rgba(168,85,247,0.1)",  text:"#c084fc", border:"rgba(168,85,247,0.2)" },
    Business:      { bg:"rgba(34,197,94,0.1)",   text:"#4ade80", border:"rgba(34,197,94,0.2)"  },
    Sports:        { bg:"rgba(245,158,11,0.1)",  text:"#fbbf24", border:"rgba(245,158,11,0.2)" },
    Science:       { bg:"rgba(56,189,248,0.1)",  text:"#7dd3fc", border:"rgba(56,189,248,0.2)" },
    World:         { bg:"rgba(244,63,94,0.1)",   text:"#fb7185", border:"rgba(244,63,94,0.2)"  },
    India:         { bg:"rgba(249,115,22,0.1)",  text:"#fb923c", border:"rgba(249,115,22,0.2)" },
    Entertainment: { bg:"rgba(236,72,153,0.1)",  text:"#f472b6", border:"rgba(236,72,153,0.2)" },
  } as Record<string, {bg:string;text:string;border:string}>,

  sent: {
    positive: { color:"#22c55e", bg:"rgba(34,197,94,0.08)",   label:"Positive", icon:"↑" },
    neutral:  { color:"#8b92b8", bg:"rgba(139,146,184,0.08)", label:"Neutral",  icon:"→" },
    negative: { color:"#f43f5e", bg:"rgba(244,63,94,0.08)",   label:"Negative", icon:"↓" },
  } as Record<string, {color:string;bg:string;label:string;icon:string}>,
} as const;

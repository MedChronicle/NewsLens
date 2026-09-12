import { useApp } from "../context/AppContext";

export default function Settings() {
  const { apiStatus } = useApp();

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Configure data sources and preferences</p>
        </div>

        {/* NewsAPI Section */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">NewsAPI Live Data</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Real-time articles from Reuters, BBC News, TechCrunch, Bloomberg, and 80,000+ other sources, fetched through a secure server-side endpoint.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-5">
            <div
              className={`w-2 h-2 rounded-full ${
                apiStatus === "valid"
                  ? "bg-green-500"
                  : apiStatus === "checking"
                    ? "bg-yellow-500 animate-pulse"
                    : apiStatus === "invalid"
                      ? "bg-red-500"
                      : "bg-gray-300"
              }`}
            />
            <span className="text-xs text-gray-500 font-mono">
              {apiStatus === "valid"
                ? "Connected — live data enabled"
                : apiStatus === "checking"
                  ? "Checking connection..."
                  : apiStatus === "invalid"
                    ? "Live feed unavailable — showing curated articles"
                    : "Not configured — showing curated articles"}
            </span>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-xs font-semibold text-blue-700 mb-2">For the person deploying this app:</p>
            <ol className="text-xs text-blue-600 space-y-1 list-decimal list-inside">
              <li>Get a free key at <span className="font-mono bg-blue-100 px-1 rounded">newsapi.org</span></li>
              <li>In Vercel: Project Settings → Environment Variables</li>
              <li>Add <span className="font-mono bg-blue-100 px-1 rounded">NEWS_API_KEY</span> with your key as the value</li>
              <li>Redeploy — the <span className="font-mono bg-blue-100 px-1 rounded">/api/news</span> function picks it up automatically</li>
            </ol>
            <p className="text-[11px] text-blue-400 mt-2 font-mono">
              No key ever ships to the browser — it's read only inside the serverless function. Without one configured, the app shows curated sample articles instead.
            </p>
          </div>
        </div>

        {/* Sources Info */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Available Sources (via NewsAPI)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: "Reuters", desc: "International wire service", available: true },
              { name: "BBC News", desc: "UK public broadcaster", available: true },
              { name: "Bloomberg", desc: "Financial news", available: true },
              { name: "TechCrunch", desc: "Technology news", available: true },
              { name: "The Guardian", desc: "UK newspaper", available: true },
              { name: "ESPN", desc: "Sports media", available: true },
              { name: "Al Jazeera", desc: "Qatari news network", available: true },
              { name: "Wired", desc: "Tech & culture", available: true },
              { name: "NDTV", desc: "Indian news network", available: false },
              { name: "Times of India", desc: "Indian newspaper", available: false },
              { name: "The Hindu", desc: "Indian newspaper", available: false },
              { name: "Mint", desc: "Indian financial daily", available: false },
            ].map((s) => (
              <div key={s.name} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${s.available ? "bg-green-500" : "bg-gray-300"}`} />
                <div>
                  <p className="text-xs font-semibold text-gray-700">{s.name}</p>
                  <p className="text-[10px] text-gray-400">{s.desc}</p>
                  {!s.available && <p className="text-[10px] text-amber-500 font-mono mt-0.5">mock data only</p>}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-4 font-mono">
            Indian sources (NDTV, Times of India, The Hindu, Mint) are not indexed by NewsAPI. Their stories appear in the mock dataset and via their &quot;India&quot; category articles.
          </p>
        </div>

        {/* Preferences */}
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Data Preferences</h2>
          <div className="space-y-4">
            {[
              { label: "Show breaking news ticker", defaultOn: true },
              { label: "Enable AI summary previews on cards", defaultOn: true },
              { label: "Show sentiment badges", defaultOn: true },
              { label: "Auto-refresh feed every 15 minutes", defaultOn: false },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{pref.label}</span>
                <button
                  className={`relative w-10 h-5 rounded-full transition-colors ${pref.defaultOn ? "bg-blue-600" : "bg-gray-200"}`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      pref.defaultOn ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-gray-400 text-center font-mono">
          NewsLens v2.0 · Built with NewsAPI.org · 47 active sources · Data refreshes every 15 min
        </p>
      </div>
    </div>
  );
}

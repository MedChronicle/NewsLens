import { useState } from "react";
import { ARTICLES, CATEGORIES, SOURCES, type Category, type Sentiment } from "../data";
import { CategoryTag, SentimentBadge, SourceAvatar, FilterChip, ReadTime } from "../components/shared";

export default function SearchResults({
  onSelectArticle,
}: {
  onSelectArticle: (id: string) => void;
}) {
  const [query, setQuery] = useState("AI");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState<{
    categories: Category[];
    sentiments: Sentiment[];
    sources: string[];
  }>({ categories: [], sentiments: [], sources: [] });
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const removeFilter = (type: "categories" | "sentiments" | "sources", val: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: (prev[type] as string[]).filter((v) => v !== val),
    }));
  };

  const toggleFilter = (
    type: "categories" | "sentiments" | "sources",
    val: string
  ) => {
    setActiveFilters((prev) => {
      const arr = prev[type] as string[];
      return {
        ...prev,
        [type]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
      };
    });
  };

  const filtered = ARTICLES.filter((a) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      a.headline.toLowerCase().includes(q) ||
      a.source.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q)) ||
      a.category.toLowerCase().includes(q);
    const matchesCat =
      activeFilters.categories.length === 0 ||
      activeFilters.categories.includes(a.category);
    const matchesSentiment =
      activeFilters.sentiments.length === 0 ||
      activeFilters.sentiments.includes(a.sentiment);
    const matchesSource =
      activeFilters.sources.length === 0 ||
      activeFilters.sources.includes(a.source);
    return matchesQuery && matchesCat && matchesSentiment && matchesSource;
  });

  const allChips: { label: string; type: "categories" | "sentiments" | "sources"; val: string }[] = [
    ...activeFilters.categories.map((v) => ({ label: v, type: "categories" as const, val: v })),
    ...activeFilters.sentiments.map((v) => ({ label: v, type: "sentiments" as const, val: v })),
    ...activeFilters.sources.map((v) => ({ label: v, type: "sources" as const, val: v })),
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white placeholder-gray-400 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                showFilterPanel || allChips.length > 0
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters {allChips.length > 0 && `(${allChips.length})`}
            </button>
            {/* View toggle */}
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-3 transition-colors ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-3 transition-colors ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div className="mt-3 p-4 bg-gray-50 border border-gray-100 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2">Category</p>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleFilter("categories", cat)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        activeFilters.categories.includes(cat)
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2">Sentiment</p>
                <div className="flex flex-wrap gap-1.5">
                  {(["positive", "neutral", "negative"] as Sentiment[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleFilter("sentiments", s)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                        activeFilters.sentiments.includes(s)
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {s === "positive" ? "😊" : s === "neutral" ? "😐" : "😟"} {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-2">Source</p>
                <div className="flex flex-wrap gap-1.5">
                  {SOURCES.slice(0, 6).map((src) => (
                    <button
                      key={src}
                      onClick={() => toggleFilter("sources", src)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        activeFilters.sources.includes(src)
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {src}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Active filter chips */}
          {allChips.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {allChips.map((chip) => (
                <FilterChip
                  key={`${chip.type}-${chip.val}`}
                  label={chip.label}
                  onRemove={() => removeFilter(chip.type, chip.val)}
                />
              ))}
              <button
                onClick={() =>
                  setActiveFilters({ categories: [], sentiments: [], sources: [] })
                }
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-xs text-gray-400">
            <span className="text-gray-700 font-medium">{filtered.length}</span>{" "}
            results for &quot;{query}&quot;
          </p>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium text-gray-600">No results found</p>
            <p className="text-sm mt-1">Try different keywords or remove some filters</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((a) => (
              <div
                key={a.id}
                className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => onSelectArticle(a.id)}
              >
                <div className="h-40 bg-gray-100 overflow-hidden">
                  <img
                    src={a.thumbnail}
                    alt={a.headline}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    <CategoryTag category={a.category} />
                    <SentimentBadge sentiment={a.sentiment} score={a.sentimentScore} compact />
                  </div>
                  <h3 className="font-display text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors mb-2">
                    {a.headline}
                  </h3>
                  <div className="flex items-center gap-2">
                    <SourceAvatar source={a.source} size="sm" />
                    <span className="text-[11px] text-gray-500">{a.source}</span>
                    <span className="text-gray-300">·</span>
                    <ReadTime minutes={a.readTime} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((a) => (
              <div
                key={a.id}
                className="group flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-all cursor-pointer"
                onClick={() => onSelectArticle(a.id)}
              >
                <div className="w-20 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={a.thumbnail}
                    alt={a.headline}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <CategoryTag category={a.category} />
                    <SentimentBadge sentiment={a.sentiment} score={a.sentimentScore} compact />
                  </div>
                  <h3 className="font-display text-sm font-semibold text-gray-900 leading-snug line-clamp-1 group-hover:text-blue-700 transition-colors">
                    {a.headline}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <SourceAvatar source={a.source} size="sm" />
                    <span className="text-[11px] text-gray-500">{a.source}</span>
                    <span className="text-gray-300">·</span>
                    <ReadTime minutes={a.readTime} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

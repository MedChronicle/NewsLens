import { useApp } from "../context/AppContext";
import { CATEGORY_COLORS, type Category } from "../data";

export default function ReadingHistory({ onSelectArticle }: { onSelectArticle: (id: string) => void }) {
  const { readingHistory, clearHistory } = useApp();

  const grouped = readingHistory.reduce<Record<string, typeof readingHistory>>((acc, item) => {
    const date = new Date(item.readAt).toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" });
    acc[date] = acc[date] || [];
    acc[date].push(item);
    return acc;
  }, {});

  if (readingHistory.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-600">No reading history yet</p>
          <p className="text-sm mt-1">Articles you open will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-semibold text-gray-900">Reading History</h1>
            <p className="text-sm text-gray-400 font-mono mt-1">{readingHistory.length} articles read</p>
          </div>
          <button onClick={clearHistory} className="px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium">
            Clear all
          </button>
        </div>
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mb-3">{date}</p>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={`${item.id}-${item.readAt}`}
                    className="group flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-sm hover:border-gray-200 transition-all cursor-pointer"
                    onClick={() => onSelectArticle(item.id)}>
                    <div className="w-14 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium mb-1 ${CATEGORY_COLORS[item.category as Category] || "bg-gray-100 text-gray-600"}`}>
                        {item.category.toUpperCase()}
                      </span>
                      <p className="text-sm font-display font-medium text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-1 leading-snug">
                        {item.headline}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{item.source}</p>
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono flex-shrink-0">
                      {new Date(item.readAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

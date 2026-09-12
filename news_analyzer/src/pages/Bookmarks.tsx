import { useApp } from "../context/AppContext";
import { ARTICLES } from "../data";
import { CategoryTag, SentimentBadge, SourceAvatar, ReadTime } from "../components/shared";
import BookmarkButton from "../components/BookmarkButton";

export default function Bookmarks({ onSelectArticle }: { onSelectArticle: (id: string) => void }) {
  const { bookmarks } = useApp();
  const saved = ARTICLES.filter((a) => bookmarks.includes(a.id));

  if (bookmarks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-600">No bookmarks yet</p>
          <p className="text-sm mt-1">Tap the bookmark icon on any article to save it here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-semibold text-gray-900">Bookmarks</h1>
            <p className="text-sm text-gray-400 font-mono mt-1">{saved.length} saved articles</p>
          </div>
        </div>

        <div className="space-y-3">
          {saved.map((article) => (
            <div
              key={article.id}
              className="group bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-all cursor-pointer flex gap-4"
              onClick={() => onSelectArticle(article.id)}
            >
              <div className="w-24 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={article.thumbnail}
                  alt={article.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                  <CategoryTag category={article.category} />
                  <SentimentBadge sentiment={article.sentiment} score={article.sentimentScore} compact />
                </div>
                <h3 className="font-display text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors leading-snug">
                  {article.headline}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <SourceAvatar source={article.source} />
                  <span className="text-[11px] text-gray-500">{article.source}</span>
                  <span className="text-gray-300">·</span>
                  <ReadTime minutes={article.readTime} />
                  <span className="text-gray-300">·</span>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {new Date(article.publishedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 self-start">
                <BookmarkButton articleId={article.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

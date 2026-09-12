import { useState, useEffect, useRef } from "react";
import { ARTICLES } from "../data";
import { CategoryTag, SentimentBadge, SourceAvatar } from "../components/shared";
import BookmarkButton from "../components/BookmarkButton";

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = document.getElementById("article-content");
    const onScroll = () => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pct = Math.min(100, Math.max(0, ((window.innerHeight - rect.top) / rect.height) * 100));
      setProgress(pct);
    };
    const container = document.getElementById("article-scroll-container");
    container?.addEventListener("scroll", onScroll, { passive: true });
    return () => container?.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-[88px] left-0 right-0 h-0.5 bg-gray-100 z-20">
      <div
        className="h-full bg-blue-500 transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function ShareButton({ headline }: { headline: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-medium transition-colors"
      title={`Share: ${headline}`}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}

export default function ArticleDetail({
  articleId,
  onBack,
  onSelectArticle,
}: {
  articleId: string;
  onBack: () => void;
  onSelectArticle: (id: string) => void;
}) {
  const article = ARTICLES.find((a) => a.id === articleId);
  const [whyExpanded, setWhyExpanded] = useState(false);

  const related = ARTICLES.filter(
    (a) => a.id !== articleId && a.category === article?.category
  ).slice(0, 3);

  if (!article) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Article not found
      </div>
    );
  }

  return (
    <div id="article-scroll-container" className="flex-1 overflow-y-auto relative">
      <ReadingProgress />
      <div id="article-content" className="max-w-4xl mx-auto px-6 py-8">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to feed
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Main */}
          <article>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <CategoryTag category={article.category} />
              {article.isBreaking && (
                <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold tracking-widest animate-pulse">
                  BREAKING
                </span>
              )}
              {article.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[11px] font-mono">
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="font-display text-3xl font-semibold text-gray-900 leading-tight mb-4">
              {article.headline}
            </h1>

            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100 flex-wrap">
              <SourceAvatar source={article.source} size="md" />
              <div>
                <p className="text-sm font-semibold text-gray-800">{article.source}</p>
                <p className="text-xs text-gray-400 font-mono">
                  By {article.author} ·{" "}
                  {new Date(article.publishedAt).toLocaleString("en-IN", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="font-mono text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
                  {article.readTime} min read
                </span>
                <ShareButton headline={article.headline} />
                <BookmarkButton articleId={article.id} size="md" />
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-72 bg-gray-100 rounded-xl overflow-hidden mb-6">
              <img
                src={article.thumbnail}
                alt={article.headline}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded font-mono">
                {article.source}
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed text-[15px] mb-8">{article.fullText}</p>

            {/* Why It Matters */}
            <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setWhyExpanded(!whyExpanded)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <span className="font-semibold text-gray-800 text-sm">Why This Matters</span>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${whyExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {whyExpanded && (
                <div className="px-4 pb-5 border-t border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed mt-4">{article.whyItMatters}</p>
                </div>
              )}
            </div>

            {/* Coverage Comparison */}
            {article.coverageComparison.length > 0 && (
              <div className="mb-8">
                <h2 className="font-mono text-[10px] font-medium text-gray-400 tracking-widest uppercase mb-4">
                  Compare Coverage
                </h2>
                <div className="space-y-3">
                  {article.coverageComparison.map((item) => (
                    <div key={item.source} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                      <div className="flex items-start gap-3">
                        <SourceAvatar source={item.source} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-sm text-gray-800">{item.source}</span>
                            <SentimentBadge sentiment={item.sentiment} score={0.7} compact />
                          </div>
                          <p className="text-sm font-display font-medium text-gray-700 leading-snug mb-1">{item.headline}</p>
                          <p className="text-xs text-gray-400 leading-snug">{item.angle}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Articles */}
            {related.length > 0 && (
              <div>
                <h2 className="font-mono text-[10px] font-medium text-gray-400 tracking-widest uppercase mb-4">
                  Related Stories
                </h2>
                <div className="space-y-3">
                  {related.map((rel) => (
                    <div
                      key={rel.id}
                      className="group flex gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer"
                      onClick={() => onSelectArticle(rel.id)}
                    >
                      <div className="w-16 h-14 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={rel.thumbnail} alt={rel.headline} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-500 mb-1">{rel.source}</p>
                        <p className="text-sm font-display font-medium text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                          {rel.headline}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
            {/* AI Summary */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-semibold text-blue-800 text-sm">AI Summary</span>
                <span className="ml-auto text-[10px] text-blue-400 font-mono">GPT-5</span>
              </div>
              <ul className="space-y-2">
                {article.summary.map((point, i) => (
                  <li key={i} className="flex gap-2 text-xs text-blue-700 leading-snug">
                    <span className="font-mono text-blue-400 mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sentiment Widget */}
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <h3 className="font-mono text-[10px] font-medium text-gray-400 tracking-widest uppercase mb-3">
                Sentiment Analysis
              </h3>
              <SentimentBadge sentiment={article.sentiment} score={article.sentimentScore} />
              <div className="mt-4 pt-3 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 font-mono mb-2">Confidence breakdown</p>
                {(["positive", "neutral", "negative"] as const).map((s) => {
                  const scores: Record<string, number> = {
                    positive: article.sentiment === "positive" ? article.sentimentScore : 1 - article.sentimentScore - 0.1,
                    neutral: article.sentiment === "neutral" ? article.sentimentScore : 0.15,
                    negative: article.sentiment === "negative" ? article.sentimentScore : 1 - article.sentimentScore - 0.12,
                  };
                  const sc = Math.max(0.02, Math.min(0.98, scores[s]));
                  const colors = { positive: "bg-green-500", neutral: "bg-gray-400", negative: "bg-red-500" };
                  const labels = { positive: "😊 Positive", neutral: "😐 Neutral", negative: "😟 Negative" };
                  return (
                    <div key={s} className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] text-gray-500 w-20 flex-shrink-0">{labels[s]}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${colors[s]} rounded-full`} style={{ width: `${sc * 100}%` }} />
                      </div>
                      <span className="font-mono text-[10px] text-gray-500 w-8 text-right">{Math.round(sc * 100)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <h3 className="font-mono text-[10px] font-medium text-gray-400 tracking-widest uppercase mb-3">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-gray-100 cursor-pointer transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Source link */}
            {article.url && article.url !== "#" && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Read Full Article
              </a>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

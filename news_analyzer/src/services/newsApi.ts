export interface NewsApiArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
  code?: string;
  message?: string;
}

const CATEGORY_MAP: Record<string, string> = {
  Technology: "technology",
  AI: "technology",
  Business: "business",
  Sports: "sports",
  Science: "science",
  World: "general",
  India: "general",
  Entertainment: "entertainment",
};

async function apiFetch(params: Record<string, string>): Promise<NewsApiResponse> {
  const qs = new URLSearchParams(params);
  const res = await fetch(`/api/news?${qs.toString()}`);
  const data: NewsApiResponse = await res.json();

  if (!res.ok || data.status === "error") {
    throw new Error(data.message || `Request failed (HTTP ${res.status})`);
  }
  return data;
}

// Calls our own /api/news serverless function — the NewsAPI key stays on
// the server, so nothing secret ever reaches the browser.
export async function fetchHeadlines(
  category?: string,
  pageSize = 20,
  page = 1
): Promise<NewsApiResponse> {
  const params: Record<string, string> = {
    type: "headlines",
    pageSize: String(pageSize),
    page: String(page),
  };
  const mappedCat = category && CATEGORY_MAP[category];
  if (mappedCat) params.category = mappedCat;

  return apiFetch(params);
}

export async function searchArticles(
  query: string,
  pageSize = 20,
  page = 1
): Promise<NewsApiResponse> {
  return apiFetch({
    type: "search",
    q: query,
    pageSize: String(pageSize),
    page: String(page),
  });
}

export function transformNewsApiArticle(
  raw: NewsApiArticle,
  idx: number
): import("../data").Article {
  const sentiments: import("../data").Sentiment[] = ["positive", "neutral", "negative"];
  const categories: import("../data").Category[] = [
    "Technology", "AI", "Business", "Sports", "Science", "World", "India", "Entertainment",
  ];

  const sentiment = sentiments[idx % 3];
  const sentimentScore = 0.55 + (idx % 5) * 0.08;

  return {
    id: `live-${idx}-${Date.now()}`,
    headline: raw.title?.replace(/\s*-\s*[^-]+$/, "") || "Untitled",
    source: raw.source.name || "Unknown",
    sourceUrl: raw.url,
    author: raw.author || "Staff Reporter",
    publishedAt: raw.publishedAt,
    category: categories[idx % categories.length],
    sentiment,
    sentimentScore,
    thumbnail:
      raw.urlToImage ||
      `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=450&fit=crop&auto=format`,
    summary: (raw.description || raw.content || "")
      .split(". ")
      .filter(Boolean)
      .slice(0, 4)
      .map((s) => s.trim() + (s.endsWith(".") ? "" : ".")),
    fullText: raw.content?.replace(/\[\+\d+ chars\]/, "") || raw.description || "",
    whyItMatters:
      "This story reflects broader trends that will shape policy, markets, and public discourse in the coming weeks.",
    tags: raw.title
      ? raw.title.split(/\s+/).filter((w) => w.length > 5).slice(0, 4)
      : [],
    readTime: Math.max(2, Math.ceil((raw.content?.length || 500) / 1000)),
    coverageComparison: [],
    url: raw.url,
  };
}

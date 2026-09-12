// Vercel Serverless Function — runs on the server, never in the browser.
// The NewsAPI key lives only here, read from an environment variable,
// so it is never shipped to the client or committed to the repo.
//
// Frontend calls:  GET /api/news?type=headlines&category=technology&pageSize=20&page=1
//                   GET /api/news?type=search&q=ai&pageSize=20&page=1

export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    res.status(200).json({
      status: "error",
      code: "not_configured",
      message:
        "NEWS_API_KEY is not set on the server. Add it in your Vercel project's Environment Variables and redeploy.",
    });
    return;
  }

  const { type = "headlines", category, q, pageSize = "20", page = "1" } = req.query;

  const params = new URLSearchParams({
    apiKey,
    language: "en",
    pageSize: String(pageSize),
    page: String(page),
  });

  let url;
  if (type === "search") {
    params.set("q", typeof q === "string" && q.trim() ? q.trim() : "news");
    params.set("sortBy", "publishedAt");
    url = `https://newsapi.org/v2/everything?${params.toString()}`;
  } else {
    if (typeof category === "string" && category) params.set("category", category);
    url = `https://newsapi.org/v2/top-headlines?${params.toString()}`;
  }

  try {
    const upstream = await fetch(url);
    const data = await upstream.json();

    // Cache successful responses briefly at the edge/CDN to save API quota.
    if (upstream.ok) {
      res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");
    }
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(502).json({
      status: "error",
      code: "upstream_failure",
      message: "Could not reach NewsAPI. Please try again shortly.",
    });
  }
}

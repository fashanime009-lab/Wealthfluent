const NEWS_ENDPOINT = "/api/news";
export const NEWS_REFRESH_INTERVAL = 60000;
export const DEFAULT_NEWS_QUERY = "finance OR stock market OR economy";

const responseCache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL = 45000;

export function cleanNewsText(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function shortNewsDescription(value = "") {
  const cleaned = cleanNewsText(value);
  if (!cleaned) return "Open the full story for the latest details and context.";
  return cleaned.length > 150 ? `${cleaned.slice(0, 147)}...` : cleaned;
}

export function normalizeArticle(article = {}, index = 0) {
  const category = Array.isArray(article.category) ? article.category[0] : article.category;

  return {
    id: article.id || article.article_id || article.link || `${article.title || "news"}-${index}`,
    title: cleanNewsText(article.title || "Financial news"),
    description: shortNewsDescription(article.description || article.content),
    link: article.link || article.url || "",
    source: cleanNewsText(article.source || article.source_name || "NewsData"),
    publishedAt: article.publishedAt || article.pubDate || article.pubDateTZ || new Date().toISOString(),
    image: article.image || article.image_url || "",
    category: category || "Finance",
  };
}

export function dedupeArticles(articles = []) {
  const seen = new Set();

  return articles.filter((article) => {
    const key = article.link || article.id || article.title;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return Boolean(article.title && article.link);
  });
}

function newsUrl({ category = "business", query = "", page = "", limit = "" } = {}) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (query.trim()) params.set("q", query.trim());
  if (page) params.set("page", page);
  if (limit) params.set("limit", String(limit));

  const queryString = params.toString();
  return queryString ? `${NEWS_ENDPOINT}?${queryString}` : NEWS_ENDPOINT;
}

export async function fetchNews({ category = "business", query = "", page = "", limit = 20, force = false } = {}) {
  const requestKey = JSON.stringify({ category, query, page, limit });
  const cached = responseCache.get(requestKey);

  if (!force && cached && Date.now() - cached.createdAt < CACHE_TTL) {
    return cached.payload;
  }

  if (!force && inFlightRequests.has(requestKey)) {
    return inFlightRequests.get(requestKey);
  }

  const request = fetch(newsUrl({ category, query, page, limit }), {
    headers: { Accept: "application/json" },
  })
    .then(async (response) => {
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Live news is unavailable right now.");
      }

      const articles = dedupeArticles((data.results || []).map(normalizeArticle));
      const payload = {
        articles,
        nextPage: data.nextPage || "",
        fetchedAt: data.fetchedAt || new Date().toISOString(),
        provider: data.provider || "NewsData.io",
      };

      responseCache.set(requestKey, {
        createdAt: Date.now(),
        payload,
      });

      return payload;
    })
    .finally(() => {
      inFlightRequests.delete(requestKey);
    });

  inFlightRequests.set(requestKey, request);
  return request;
}

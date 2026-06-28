import { getGNews } from "./providers/gnews.js";
import { getTheNews } from "./providers/thenews.js";
import { rateLimit } from "./lib/rateLimit.js";
const cache = new Map();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes


const NEWSDATA_ENDPOINT = "https://newsdata.io/api/1/news";
const ALLOWED_CATEGORIES = new Set([
  "business",
  "technology",
  "science",
]);

function cleanText(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function shortDescription(value = "") {
  const cleaned = cleanText(value);
  if (!cleaned) return "Open the full story for the latest details and context.";
  return cleaned.length > 150 ? `${cleaned.slice(0, 147)}...` : cleaned;
}

function normalizeArticle(article = {}, index = 0) {
  const category = Array.isArray(article.category) ? article.category[0] : article.category;

  return {
    id: article.article_id || article.link || `${article.title || "news"}-${index}`,
    title: cleanText(article.title || "Financial news"),
    description: shortDescription(article.description || article.content),
    link: article.link || "",
    source: cleanText(article.source_name || "NewsData"),
    publishedAt: article.pubDate || new Date().toISOString(),
    image: article.image_url || "",
    category: category || "Finance",
  };
}

function dedupeArticles(articles = []) {
  const seen = new Set();

  return articles.filter((article) => {
    const key = article.link || article.id || article.title;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return Boolean(article.title && article.link);
  });
}

function safeString(value, fallback = "") {
  if (Array.isArray(value)) return value[0] || fallback;
  return typeof value === "string" ? value : fallback;
}

function numberInRange(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function sendJson(res, status, payload) {
  res.status(status).json(payload);
}

export default async function handler(req, res) {
  console.log("NEWS API HIT");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, {
      success: false,
      message: "Only GET requests are supported.",
      results: [],
    });
  }
const ip =
  req.headers["x-forwarded-for"] ||
  req.socket.remoteAddress ||
  "unknown";

if (!rateLimit(ip, 60, 60000)) {
  return sendJson(res, 429, {
    success: false,
    message: "Too many requests.",
    results: [],
  });
}
  const apiKey = process.env.NEWSDATA_API_KEY;

  if (!apiKey) {
    return sendJson(res, 500, {
      success: false,
      message: "News service is not configured.",
      results: [],
    });
  }

  const requestedCategory = safeString(req.query.category, "business").toLowerCase();
  const category = ALLOWED_CATEGORIES.has(requestedCategory) ? requestedCategory : "business";
  const query = safeString(req.query.q, "").trim().slice(0, 120);
  const page = Number.parseInt(
  safeString(req.query.page, "1"),
  10
) || 1;
  const limit = numberInRange(req.query.limit, 20, 1, 50);
const type = safeString(req.query.type, "news");
  const cacheKey = JSON.stringify({
  type,
  category,
  query,
  page,
  limit,
});

const cached = cache.get(cacheKey);

if (
  cached &&
  Date.now() - cached.time < CACHE_DURATION
) {
  return sendJson(res, 200, cached.payload);
}

 const NEWS_QUERY =
  "finance OR stock market OR economy OR business OR banking OR earnings OR IPO OR companies";

const BLOG_QUERY =
  "personal finance OR retirement OR SIP OR mutual funds OR tax OR wealth building OR investing guide";

const params = new URLSearchParams({
  apikey: apiKey,
  language: "en",
  q: type === "blogs" ? BLOG_QUERY : NEWS_QUERY,
  size: String(limit),
});

  if (query.trim()) {
  params.set("q", query.trim());
}
  if (page) params.set("page", page);

  try {
    const response = await fetch(`${NEWSDATA_ENDPOINT}?${params.toString()}`, {
      headers: {
        Accept: "application/json",
      },
    });
    console.log("Status:", response.status);

const data = await response.json().catch(() => ({}));

console.log("Response:", data);

    if (!response.ok || data.status === "error") {

  console.warn("NewsData failed. Switching to GNews...");

  try {

    const gnews = await getGNews({
      category,
      query,
      limit,
    });

    res.setHeader(
      "Cache-Control",
      "s-maxage=60, stale-while-revalidate=300"
    );

   const payload = {
  success: true,
  provider: gnews.provider,
  fetchedAt: new Date().toISOString(),
  nextPage: "",
  results: gnews.results,
};

cache.set(cacheKey, {
  time: Date.now(),
  payload,
});

return sendJson(res, 200, payload);

  } catch (gnewsError) {

    console.error("GNews failed:", gnewsError);

    try {

   const news = await getTheNews({
    category,
    limit,
    page,
});

    const payload = {
    success: true,
    provider: news.provider,
    fetchedAt: new Date().toISOString(),
    nextPage: news.nextPage,
    results: news.results,
};

cache.set(cacheKey, {
  time: Date.now(),
  payload,
});

return sendJson(res, 200, payload);

} catch(err){

    console.error("TheNewsAPI failed:",err);

    return sendJson(res,500,{
        success:false,
        message:"All news providers are unavailable.",
        results:[]
    });

}

  }

}

    const FINANCE_KEYWORDS = [
  "finance",
  "financial",
  "stock",
  "stocks",
  "market",
  "economy",
  "economic",
  "invest",
  "investment",
  "bank",
  "banking",
  "forex",
  "crypto",
  "bitcoin",
  "ethereum",
  "mutual fund",
  "etf",
  "nasdaq",
  "dow",
  "s&p",
  "inflation",
  "interest rate",
  "federal reserve",
  "earnings",
  "ipo",
];

const results = dedupeArticles(
  (data.results || [])
    .map(normalizeArticle)
    .filter((article) => {
      const text = (
        article.title +
        " " +
        article.description
      ).toLowerCase();

      return FINANCE_KEYWORDS.some((keyword) =>
        text.includes(keyword)
      );
    })
);

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

    const payload = {
    success: true,
    provider: "NewsData.io",
    fetchedAt: new Date().toISOString(),
    nextPage: data.nextPage || "",
    results,
};

cache.set(cacheKey, {
  time: Date.now(),
  payload,
});

return sendJson(res, 200, payload);
  } catch (error) {
    console.error("News endpoint failed", error);

    return sendJson(res, 500, {
      success: false,
      message: "Unable to fetch live news right now.",
      results: [],
    });
  }
}

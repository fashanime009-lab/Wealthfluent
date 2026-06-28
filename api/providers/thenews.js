const ENDPOINT = "https://api.thenewsapi.com/v1/news/top";

function cleanText(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function shortDescription(value = "") {
  const text = cleanText(value);

  if (!text)
    return "Open the full story for the latest details.";

  return text.length > 150
    ? text.slice(0, 147) + "..."
    : text;
}

export async function getTheNews({
  category = "business",
  limit = 20,
  page = 1,
}) {

  const apiKey = process.env.THENEWS_API_KEY;

  if (!apiKey)
    throw new Error("Missing TheNewsAPI key");

  const params = new URLSearchParams({
  api_token: apiKey,
  locale: "us",
  language: "en",
  categories: category,
  limit: String(limit),
  page: String(page),
});

  const response = await fetch(
    `${ENDPOINT}?${params.toString()}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "TheNewsAPI failed"
    );
  }

 return {
    provider: "TheNewsAPI",

    nextPage:
      (data.data || []).length === limit
        ? String(page + 1)
        : "",

    results: (data.data || []).map((article, index) => ({
      id: article.uuid || index,
      title: cleanText(article.title),
      description: shortDescription(article.description),
      link: article.url,
      image: article.image_url,
      source: article.source || "TheNewsAPI",
      publishedAt: article.published_at,
      category,
    })),
  };
}
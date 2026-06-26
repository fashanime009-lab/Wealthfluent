const GNEWS_ENDPOINT = "https://gnews.io/api/v4/top-headlines";

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
    ? text.substring(0, 147) + "..."
    : text;
}

export async function getGNews({
  category = "business",
  query = "",
  limit = 20,
}) {

  const apiKey = process.env.GNEWS_API_KEY;

  if (!apiKey)
    throw new Error("Missing GNews API key");

  const params = new URLSearchParams({
    token: apiKey,
    lang: "en",
    max: String(limit),
    topic: category === "top" ? "breaking-news" : category,
  });

  if (query)
    params.set("q", query);

  const response = await fetch(
    `${GNEWS_ENDPOINT}?${params}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.errors?.join(", ") ||
      data.message ||
      "GNews failed"
    );
  }

  return {
    provider: "GNews",

    nextPage: "",

    results: (data.articles || []).map((article, index) => ({
      id: article.url || index,

      title: cleanText(article.title),

      description: shortDescription(article.description),

      link: article.url,

      image: article.image,

      source: article.source?.name || "GNews",

      publishedAt: article.publishedAt,

      category,
    })),
  };

}
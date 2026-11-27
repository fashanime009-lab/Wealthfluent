import { SITE_URL, SITE_NAME } from "./Seo";
import { SOCIAL_LINKS } from "../../data/social";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  // Google's structured-data logo guidance doesn't list SVG as a supported
  // format (JPG/PNG/WebP only) — logo.png is a 512x512 PNG rendered
  // straight from favicon.svg (public/favicon.svg), not a separate asset
  // to keep in sync by hand.
  logo: `${SITE_URL}/logo.png`,
  description:
    "FINAIW is a free personal finance platform offering calculators, verdicts, goal tracking, and financial education tools.",
  sameAs: SOCIAL_LINKS.map((s) => s.url),
};

// No SearchAction here: Google's Sitelinks Search Box requires a URL that
// returns real results for an arbitrary typed-in term, and /calculators?
// category= only matches five fixed category ids (loan, investment,
// retirement, wealth, tax) — any other term renders an empty page. Claiming
// a working search that isn't one is worse than not claiming one; add this
// back only once /calculators?category= (or a dedicated endpoint) does a
// real text search.
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

/**
 * For a free calculator page. WebApplication is the more precise schema.org
 * type for a browser-only tool with no install (SoftwareApplication is its
 * generic parent type). Not rich-result eligible on its own: Google's
 * SoftwareApplication/WebApplication result also requires an
 * aggregateRating or review, which we deliberately don't invent.
 */
export function calculatorSchema({ name, description, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: `${SITE_URL}${path}`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/** For Help/FAQ-style pages — eligible for FAQ rich results. */
export function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Default reviewer for callers that don't pass their own (e.g. LessonPage,
// whose 30 lessons shipped as one batch with no per-post reviewer byline).
/**
 * For blog/lesson/guide content — eligible for Article rich results.
 * Reviewers aren't an Article property, so pages name them on a WebPage
 * node instead (webPageSchema below), pointing at this article's "@id".
 */
export function articleSchema({
  title,
  description,
  path,
  publishedTime,
  modifiedTime,
  image,
  inLanguage = "en",
  // A named Person when the content has an individual author; otherwise
  // the publisher organization is credited.
  author,
  // Optional "@id", so a WebPage node can point at this article (see
  // webPageSchema below).
  id,
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    ...(id && { "@id": id }),
    headline: title,
    description,
    url: `${SITE_URL}${path}`,
    mainEntityOfPage: `${SITE_URL}${path}`,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    inLanguage,
    image: image || `${SITE_URL}/og-image.png`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    author: author || {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

/**
 * The page an article sits on. reviewedBy is a WebPage property, not an
 * Article one, so the people who review a page are named here, and
 * mainEntity points at the article by its "@id".
 */
export function webPageSchema({ path, name, reviewedBy, mainEntityId, inLanguage = "en" }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}${path}`,
    url: `${SITE_URL}${path}`,
    name,
    inLanguage,
    ...(reviewedBy?.length && { reviewedBy }),
    ...(mainEntityId && { mainEntity: { "@id": mainEntityId } }),
  };
}

/**
 * For a calculator page's actual input steps — not generic "enter your
 * numbers" filler, but the real field labels/order on that specific
 * calculator, since Google explicitly devalues templated HowTo content
 * that doesn't reflect the page it's attached to.
 */
export function howToSchema({ name, description, steps, totalTime }) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

/** Breadcrumb trail — improves how the URL path shows in search results. */
export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

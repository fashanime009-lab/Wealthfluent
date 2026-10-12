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

/** For blog/lesson content — eligible for Article rich results. */
export function articleSchema({ title, description, path, publishedTime, modifiedTime, image }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${SITE_URL}${path}`,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    image: image || `${SITE_URL}/og-image.png`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    // Nishit B is the team member who reviews financial content before it's
    // published (see /about) — naming a real reviewer here, not just the
    // publisher org, is what Google's own guidance on finance content
    // ("YMYL") specifically asks for.
    reviewedBy: {
      "@type": "Person",
      name: "Nishit B",
      jobTitle: "Financial Crime Risk Analyst",
    },
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

import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";

export default function NotFoundPage() {
  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
      <Seo title="Page not found" description="This page doesn't exist on FINAIW." path="/404" noindex />

      <div className="mx-auto max-w-[640px] px-5 py-24 sm:px-8 lg:px-12">
        <span className="font-mono-tech text-[13px] font-semibold text-[#047857] dark:text-[#34d399]">404</span>
        <h1 className="font-display mt-2 text-[32px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[40px]">
          This page doesn't exist
        </h1>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
          The link you followed may be broken, or the page may have moved. Try one of these instead.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link
            to="/"
            className="inline-flex h-11 items-center bg-[#047857] px-5 text-[14px] font-semibold text-white transition hover:bg-[#065f46]"
          >
            Go to homepage
          </Link>
          <Link
            to="/sitemap"
            className="text-[14px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
          >
            Browse the full sitemap
          </Link>
        </div>
      </div>
    </div>
  );
}

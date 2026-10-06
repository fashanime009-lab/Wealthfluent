import { Link } from "react-router-dom";

// A single, high-visibility internal link to the site's flagship
// curiosity-driven tool — placed right after the Hero on purpose, the
// most-seen real estate on the homepage, since this page's whole job is
// to pull in visitors who've never heard of FINAIW and then hand them
// off into the rest of the site.
export default function GlobalRankBanner() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
      <Link
        to="/net-worth-percentile"
        className="group flex flex-col justify-between gap-5 rounded-lg bg-[#0e1512] p-7 transition hover:bg-[#111a16] sm:flex-row sm:items-center sm:p-8"
      >
        <div>
          <span className="text-[12.5px] font-semibold text-[#34d399]">New — Global Net Worth Percentile</span>
          <h2 className="font-display mt-1.5 text-[22px] font-extrabold leading-snug text-[#eef1ec] sm:text-[26px]">
            How rich are you, really?
          </h2>
          <p className="mt-2 max-w-[52ch] text-[13.5px] leading-6 text-[#eef1ec]/60">
            Not how you compare to your neighbors — how your net worth compares to every adult on Earth. One
            number, any currency, no signup.
          </p>
        </div>
        <span className="flex-shrink-0 text-[14px] font-semibold text-[#eef1ec] underline decoration-[#eef1ec]/30 underline-offset-4 transition group-hover:decoration-[#eef1ec]/60">
          See your global rank →
        </span>
      </Link>
    </section>
  );
}

import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";

const offerings = [
  {
    title: "Practical tools",
    desc: "Calculators for loans, investments, taxes, retirement, and more — designed to give you real answers, not more questions.",
  },
  {
    title: "A guided walkthrough",
    desc: "A clickable, structured tour of the site — not a chatbot — that points you straight to the right calculator, verdict, or goal tool for what you're trying to figure out.",
  },
  {
    title: "Real-world wisdom",
    desc: "Articles, quizzes, and tips written for everyday people — because financial education should feel like a conversation, not a lecture.",
  },
];

const whyPoints = [
  { title: "Always free", desc: "No strings attached. No hidden fees. No subscriptions." },
  { title: "Made for humans", desc: "Clear language, intuitive design, and genuine care for your journey." },
  { title: "Your data stays with you", desc: "Your financial profile, goals, and calculations are stored only in your browser, never on our servers." },
  { title: "Built with empathy", desc: "We understand that money can be stressful — we are here to make it easier." },
];

const stats = [
  { value: "20+", label: "tools to explore" },
  { value: "100%", label: "free, always" },
  { value: "0", label: "data leaves your device" },
];

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About FINAIW – Financial Intelligence for Everyone"
        description="FINAIW is a free platform offering simple, smart financial tools for real people. Start taking control of your money today."
        path="/about"
        keywords="about FINAIW, financial intelligence, money management, financial calculators, personal finance"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About FINAIW", path: "/about" },
        ])}
      />

      <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
        <div className="mx-auto max-w-[860px] px-5 py-16 sm:px-8 lg:px-12">
          <h1 className="font-display max-w-lg text-[34px] font-extrabold leading-[1.15] tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec] sm:text-[42px]">
            Helping you make smarter financial choices.
          </h1>
          <p className="mt-4 max-w-[58ch] text-[15px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
            We believe that everyone deserves to feel confident about their money. FINAIW is your
            friendly companion on the journey to financial well-being — simple, free, and made for
            real people, everywhere.
          </p>

          {/* Our Story */}
          <div className="mt-14 border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10">
            <h2 className="font-display text-[22px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec]">
              Where it started
            </h2>
            <div className="mt-3 max-w-[68ch] space-y-4 text-[14px] leading-7 text-[#111814]/65 dark:text-[#eef1ec]/65">
              <p>
                FINAIW was born from a simple realisation: financial jargon and hidden fees make it
                hard for ordinary people to take control of their money. We saw friends, family, and
                colleagues struggling to understand loans, investments, and retirement planning — not
                because they weren't smart, but because the system felt designed to confuse.
              </p>
              <p>
                So we decided to build something different. FINAIW is a space where complex financial
                concepts become clear, where tools are genuinely helpful, and where everyone —
                regardless of background or location — can find a path to financial confidence.
              </p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="mt-10 grid gap-8 border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-[17px] font-bold text-[#111814] dark:text-[#eef1ec]">Our mission</h3>
              <p className="mt-2 text-[14px] leading-6 text-[#111814]/65 dark:text-[#eef1ec]/65">
                To make financial confidence a reality for everyone — by offering clear, accessible,
                and completely free tools that help people understand their money, plan their goals,
                and live with less financial stress.
              </p>
            </div>
            <div>
              <h3 className="font-display text-[17px] font-bold text-[#111814] dark:text-[#eef1ec]">Our vision</h3>
              <p className="mt-2 text-[14px] leading-6 text-[#111814]/65 dark:text-[#eef1ec]/65">
                A world where financial literacy is not a privilege — it is a right. We envision a
                future where technology and empathy work together to help people everywhere build
                secure and fulfilling financial lives.
              </p>
            </div>
          </div>

          {/* What you'll find here */}
          <div className="mt-10 border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10">
            <h2 className="font-display text-[22px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec]">
              What you will find here
            </h2>
            <div className="mt-4 divide-y divide-[#111814]/8 dark:divide-[#eef1ec]/8">
              {offerings.map((item) => (
                <div key={item.title} className="py-5">
                  <h3 className="font-display text-[15px] font-bold text-[#111814] dark:text-[#eef1ec]">{item.title}</h3>
                  <p className="mt-1.5 max-w-[60ch] text-[13.5px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/60">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Why FINAIW */}
          <div className="mt-10 border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10">
            <h2 className="font-display text-[22px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec]">
              Why FINAIW
            </h2>
            <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {whyPoints.map((point) => (
                <div key={point.title}>
                  <h3 className="text-[14.5px] font-semibold text-[#111814] dark:text-[#eef1ec]">{point.title}</h3>
                  <p className="mt-1 text-[13px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/55">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-[#111814]/10 pt-8 dark:border-[#eef1ec]/10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <span className="font-mono-tech text-[22px] font-medium tabular-nums text-[#047857] dark:text-[#34d399]">
                  {stat.value}
                </span>
                <span className="ml-2 text-[13px] text-[#111814]/60 dark:text-[#eef1ec]/55">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-[#111814]/10 pt-10 dark:border-[#eef1ec]/10 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-[20px] font-extrabold tracking-[-0.01em] text-[#111814] dark:text-[#eef1ec]">
                Ready to take the first step?
              </h2>
              <p className="mt-2 max-w-md text-[13.5px] leading-6 text-[#111814]/60 dark:text-[#eef1ec]/60">
                Explore our calculators, ask a question, or just browse around — you are always
                welcome here.
              </p>
            </div>
            <Link
              to="/calculators"
              className="flex-shrink-0 text-[13.5px] font-semibold text-[#111814] underline decoration-[#111814]/25 underline-offset-4 dark:text-[#eef1ec] dark:decoration-[#eef1ec]/25"
            >
              Explore calculators
            </Link>
          </div>

          <p className="mt-10 text-[12px] leading-5 text-[#111814]/60 dark:text-[#eef1ec]/50">
            FINAIW is an educational platform. All tools and content are for illustrative purposes
            only. Please consult a qualified financial advisor for personalised advice.
          </p>
        </div>
      </div>
    </>
  );
}

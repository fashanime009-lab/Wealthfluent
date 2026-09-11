import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";
import {
  ArrowRight,
  CheckCircle2,
  Wrench,
  MessageCircleHeart,
  BookOpenText,
} from "lucide-react";

const offerings = [
  {
    icon: Wrench,
    title: "Practical Tools",
    desc: "Calculators for loans, investments, taxes, retirement, and more — designed to give you real answers, not more questions.",
  },
  {
    icon: MessageCircleHeart,
    title: "A Guided Walkthrough",
    desc: "A clickable, structured tour of the site — not a chatbot — that points you straight to the right calculator, verdict, or goal tool for what you're trying to figure out.",
  },
  {
    icon: BookOpenText,
    title: "Real-World Wisdom",
    desc: "Articles, quizzes, and tips written for everyday people — because financial education should feel like a conversation, not a lecture.",
  },
];

const whyPoints = [
  { title: "Always Free", desc: "No strings attached. No hidden fees. No subscriptions." },
  { title: "Made for Humans", desc: "Clear language, intuitive design, and genuine care for your journey." },
  { title: "Your Data Stays With You", desc: "Your financial profile, goals, and calculations are stored only in your browser, never on our servers." },
  { title: "Built with Empathy", desc: "We understand that money can be stressful — we are here to make it easier." },
];

const stats = [
  { value: "18+", label: "Tools to explore" },
  { value: "100%", label: "Free, always" },
  { value: "Human", label: "Centric design" },
  { value: "Global", label: "For everyone" },
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

      <div className="min-h-screen bg-[#fbfdfc]">
        <section className="mx-auto max-w-[1000px] px-5 py-14 sm:px-8 lg:px-12">
          {/* Hero */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 text-center sm:p-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[12px] font-black text-emerald-800 ring-1 ring-emerald-100">
              About FINAIW
            </span>
            <h1 className="mx-auto mt-6 max-w-2xl text-[34px] font-black leading-[1.12] tracking-[-0.03em] text-slate-950 sm:text-[46px]">
              Helping you make
              <span className="block text-emerald-700">smarter financial choices.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] font-medium leading-7 text-slate-500">
              We believe that everyone deserves to feel confident about their money. FINAIW is your
              friendly companion on the journey to financial well-being — simple, free, and made for
              real people, everywhere.
            </p>
          </div>

          {/* Our Story */}
          <div className="mt-6 rounded-[32px] border border-slate-200 bg-white p-8 sm:p-12">
            <span className="text-[12px] font-black uppercase tracking-wide text-emerald-700">Our Story</span>
            <h2 className="mt-3 text-[26px] font-black tracking-[-0.02em] text-slate-950">Where it started</h2>
            <p className="mt-5 text-[15px] leading-7 text-slate-600">
              FINAIW was born from a simple realisation: financial jargon and hidden fees make it
              hard for ordinary people to take control of their money. We saw friends, family, and
              colleagues struggling to understand loans, investments, and retirement planning — not
              because they weren't smart, but because the system felt designed to confuse.
            </p>
            <p className="mt-4 text-[15px] leading-7 text-slate-600">
              So we decided to build something different. FINAIW is a space where complex financial
              concepts become clear, where tools are genuinely helpful, and where everyone —
              regardless of background or location — can find a path to financial confidence.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-[28px] border border-slate-200 bg-white p-8">
              <h3 className="text-[19px] font-black text-slate-950">Our Mission</h3>
              <p className="mt-3 text-[14px] leading-6 text-slate-600">
                To make financial confidence a reality for everyone — by offering clear, accessible,
                and completely free tools that help people understand their money, plan their goals,
                and live with less financial stress.
              </p>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-white p-8">
              <h3 className="text-[19px] font-black text-slate-950">Our Vision</h3>
              <p className="mt-3 text-[14px] leading-6 text-slate-600">
                A world where financial literacy is not a privilege — it is a right. We envision a
                future where technology and empathy work together to help people everywhere build
                secure and fulfilling financial lives.
              </p>
            </div>
          </div>

          {/* What We Offer */}
          <div className="mt-6 rounded-[32px] border border-slate-200 bg-white p-8 sm:p-12">
            <h2 className="text-center text-[26px] font-black tracking-[-0.02em] text-slate-950">
              What you will find here
            </h2>
            <div className="mt-9 grid gap-6 md:grid-cols-3">
              {offerings.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                      <Icon size={22} />
                    </div>
                    <h4 className="mt-4 text-[16px] font-black text-slate-900">{item.title}</h4>
                    <p className="mt-2 text-[13.5px] leading-6 text-slate-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Why FINAIW */}
          <div className="mt-6 rounded-[32px] border border-emerald-100 bg-emerald-50/40 p-8 sm:p-12">
            <h2 className="text-center text-[26px] font-black tracking-[-0.02em] text-slate-950">Why FINAIW</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {whyPoints.map((point) => (
                <div key={point.title} className="flex items-start gap-3.5">
                  <span className="mt-0.5 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 size={16} />
                  </span>
                  <div>
                    <h4 className="text-[14.5px] font-black text-slate-900">{point.title}</h4>
                    <p className="mt-1 text-[13px] leading-5 text-slate-500">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                <div className="text-[26px] font-black text-emerald-800">{stat.value}</div>
                <div className="mt-1 text-[12px] font-bold text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-6 rounded-[32px] bg-emerald-900 p-8 text-center text-white sm:p-12">
            <h2 className="text-[26px] font-black tracking-[-0.02em] sm:text-[30px]">
              Ready to take the first step?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-7 text-emerald-100">
              Explore our calculators, ask a question, or just browse around — you are always
              welcome here.
            </p>
            <Link
              to="/calculators"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-[14px] font-black text-emerald-900 shadow-lg transition hover:-translate-y-0.5"
            >
              Explore Calculators <ArrowRight size={16} />
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="mt-8 text-center text-[12px] leading-5 text-slate-400">
            FINAIW is an educational platform. All tools and content are for illustrative purposes
            only. Please consult a qualified financial advisor for personalised advice.
          </p>
        </section>
      </div>
    </>
  );
}

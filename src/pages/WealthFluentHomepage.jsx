import Hero from "../components/home/Hero";
import GlobalRankBanner from "../components/home/GlobalRankBanner";
import FinancialStatusWidget from "../components/home/FinancialStatusWidget";
import StatsStrip from "../components/home/StatsStrip";
import CalculatorsSection from "../components/home/calculators/CalculatorsSection";
import WorkspacePanel from "../components/home/WorkspacePanel";
import HowItWorks from "../components/home/HowItWorks";
import TrendingStrip from "../components/home/TrendingStrip";
import AdSlot from "../components/ads/AdSlot";
import LearningSection from "../components/home/LearningSection";
import ToolFinder from "../components/home/ToolFinder";
import HomeFAQ from "../components/home/HomeFAQ";
import Seo from "@/components/seo/Seo";
import { organizationSchema, websiteSchema, faqSchema } from "@/components/seo/schema";
import { HOME_FAQ_ITEMS } from "@/data/homeFaq";

export default function WealthFluentHomepage() {
  return (
    <div className="bg-[#eef1ec] dark:bg-[#0b1210]">
      <Seo
        title="Free Financial Calculators, Verdicts & Tools | FINAIW"
        description="20+ free finance calculators (SIP, EMI, FD, CAGR, retirement, FIRE), real rent-vs-buy and debt-vs-invest verdicts, and goal tracking — no account, no paywall."
        path="/"
        keywords="financial calculators, SIP calculator, EMI calculator, retirement calculator, FIRE calculator, personal finance, investment planning"
        jsonLd={[
          organizationSchema,
          websiteSchema,
          faqSchema(HOME_FAQ_ITEMS.map((f) => ({ question: f.q, answer: f.a }))),
        ]}
      />

      <Hero />
      <div className="mt-10">
        <GlobalRankBanner />
      </div>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <FinancialStatusWidget />
      </div>
      <StatsStrip />
      <AdSlot slotId="home_leaderboard" className="mx-auto max-w-[1240px] px-5 py-6 sm:px-8 lg:px-12" />
      <CalculatorsSection />
      <WorkspacePanel />
      <HowItWorks />
      <TrendingStrip />
      <AdSlot slotId="home_mid" className="mx-auto max-w-[1240px] px-5 py-6 sm:px-8 lg:px-12" />
      <LearningSection />
      <ToolFinder />
      <HomeFAQ />
    </div>
  );
}

import LearningSection from "../components/home/LearningSection";
import TrustBanner from "../components/home/TrustBanner";
import Hero from "../components/home/Hero";
import CalculatorsSection from "../components/home/calculators/CalculatorsSection";
import WorkspacePanel from "../components/home/WorkspacePanel";
import TrendingStrip from "../components/home/TrendingStrip";
import AdSlot from "../components/ads/AdSlot";
import Seo from "../components/seo/Seo";
import { organizationSchema, websiteSchema } from "../components/seo/schema";

export default function WealthFluentHomepage() {
  return (
    <div className="finaiw-home-screen min-h-screen bg-[#fbfdfc] text-slate-950 dark:bg-slate-950 dark:text-white">
      <Seo
        title="FINAIW – Free Financial Calculators, Verdicts & Planning Tools"
        description="18+ free finance calculators (SIP, EMI, FD, CAGR, retirement, FIRE), real rent-vs-buy and debt-vs-invest verdicts, and goal tracking — no account, no paywall."
        path="/"
        keywords="financial calculators, SIP calculator, EMI calculator, retirement calculator, FIRE calculator, personal finance, investment planning"
        jsonLd={[organizationSchema, websiteSchema]}
      />

      <Hero />
      <AdSlot slotId="home_leaderboard" className="mx-auto max-w-[1660px] px-5 sm:px-8 lg:px-12" />
      <CalculatorsSection />
      <TrendingStrip />
      <WorkspacePanel />
      <AdSlot slotId="home_mid" className="mx-auto max-w-[1660px] px-5 sm:px-8 lg:px-12" />
      <LearningSection />
      <TrustBanner />
    </div>
  );
}

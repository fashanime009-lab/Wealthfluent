import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

// ─── Lazy-loaded page components ──────────────────────────────
const AboutPage = lazy(() => import("./pages/AboutPage"));
const BlogsPage = lazy(() => import("./pages/BlogsPage"));
const CAGRCalculatorPage = lazy(() => import("./pages/CAGRCalculatorPage"));
const CalculatorsPage = lazy(() => import("./pages/CalculatorsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const DisclaimerPage = lazy(() => import("./pages/DisclaimerPage"));
const EMICalculatorPage = lazy(() => import("./pages/EMICalculatorPage"));
const FDCalculatorPage = lazy(() => import("./pages/FDCalculatorPage"));
const FIRECalculatorPage = lazy(() => import("./pages/FIRECalculatorPage"));
const GSTCalculatorPage = lazy(() => import("./pages/GSTCalculatorPage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const QuizzesPage = lazy(() => import("./pages/QuizzesPage"));
const RetirementCalculatorPage = lazy(() => import("./pages/RetirementCalculatorPage"));
const SIPCalculatorPage = lazy(() => import("./pages/SIPCalculatorPage"));
const SIPWealthArticle = lazy(() => import("./pages/articles/SIPWealthArticle"));
const ToolsPage = lazy(() => import("./pages/ToolsPage"));
const WealthFluentHomepage = lazy(() => import("./pages/WealthFluentHomepage"));
const NetWorthCalculatorPage = lazy(() => import("./pages/NetWorthCalculatorPage"));
const GoalPlannerPage = lazy(() => import("./pages/GoalPlannerPage"));

const GoalSIPCalculatorPage = lazy(() => import("./pages/GoalSIPCalculatorPage"));
const AnnualRetirementIncomePage = lazy(() => import("./pages/AnnualRetirementIncomePage"));
const BondYieldCalculatorPage = lazy(() => import("./pages/BondYieldCalculatorPage"));
const FutureValueCalculatorPage = lazy(() => import("./pages/FutureValueCalculatorPage"));
const InflationCalculatorPage = lazy(() => import("./pages/InflationCalculatorPage"));
const RateOfReturnCalculatorPage = lazy(() => import("./pages/RateOfReturnCalculatorPage"));
const RetirementInvestmentTrackerPage = lazy(() => import("./pages/RetirementInvestmentTrackerPage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage"));
const SitemapPage = lazy(() => import("./pages/SitemapPage"));
const HomepageV2 = lazy(() => import("./pages/HomepageV2"));
const WorkspacePage = lazy(() => import("./pages/WorkspacePage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const NetWorthPage = lazy(() => import("./pages/NetWorthPage"));
const HomeBuyingJourney = lazy(() => import("@/journeys/home-buying/pages/HomeBuyingJourney"));
const EmergencyFundCalculatorPage = lazy(() => import("./pages/EmergencyFundCalculatorPage"));

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<WealthFluentHomepage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/quizzes" element={<QuizzesPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blog" element={<BlogsPage />} /> {/* both point to same page */}
            <Route path="/sip-calculator" element={<SIPCalculatorPage />} />
            <Route path="/emi-calculator" element={<EMICalculatorPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/fd-calculator" element={<FDCalculatorPage />} />
            <Route path="/cagr-calculator" element={<CAGRCalculatorPage />} />
            <Route path="/gst-calculator" element={<GSTCalculatorPage />} />
            <Route path="/retirement-calculator" element={<RetirementCalculatorPage />} />
            <Route path="/how-sip-builds-wealth" element={<SIPWealthArticle />} />
            <Route path="/calculators" element={<CalculatorsPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/fire-calculator" element={<FIRECalculatorPage />} />
            <Route path="/networth-calculator" element={<NetWorthCalculatorPage />} />
            <Route path="/goal-planner" element={<GoalPlannerPage />} />
            
            <Route path="/goal-sip" element={<GoalSIPCalculatorPage />} />
            <Route path="/annual-retirement-income" element={<AnnualRetirementIncomePage />} />
            <Route path="/bond-yield-calculator" element={<BondYieldCalculatorPage />} />
            <Route path="/future-value-calculator" element={<FutureValueCalculatorPage />} />
            <Route path="/inflation-calculator" element={<InflationCalculatorPage />} />
            <Route path="/rate-of-return-calculator" element={<RateOfReturnCalculatorPage />} />
            <Route path="/retirement-investment-tracker" element={<RetirementInvestmentTrackerPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/HomepageV2" element={<HomepageV2 />} />
            <Route path="/WorkspacePage" element={<WorkspacePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/NetWorthPage" element={<NetWorthPage />} />
            <Route path="/emergency-fund-calculator" element={<EmergencyFundCalculatorPage />} />
          </Route>
          <Route path="/journeys/home-buying" element={<HomeBuyingJourney />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
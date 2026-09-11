import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

// ─── Lazy-loaded page components ──────────────────────────────
const AboutPage = lazy(() => import("./pages/AboutPage"));
const LearnPage = lazy(() => import("./pages/LearnPage"));
const LessonPage = lazy(() => import("./pages/LessonPage"));
const CAGRCalculatorPage = lazy(() => import("./pages/CAGRCalculatorPage"));
const CalculatorsPage = lazy(() => import("./pages/CalculatorsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const DisclaimerPage = lazy(() => import("./pages/DisclaimerPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const EMICalculatorPage = lazy(() => import("./pages/EMICalculatorPage"));
const FDCalculatorPage = lazy(() => import("./pages/FDCalculatorPage"));
const FIRECalculatorPage = lazy(() => import("./pages/FIRECalculatorPage"));
const GSTCalculatorPage = lazy(() => import("./pages/GSTCalculatorPage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const InsightsPage = lazy(() => import("./pages/InsightsPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const QuizzesPage = lazy(() => import("./pages/QuizzesPage"));
const RetirementCalculatorPage = lazy(() => import("./pages/RetirementCalculatorPage"));
const SIPCalculatorPage = lazy(() => import("./pages/SIPCalculatorPage"));
const ToolsPage = lazy(() => import("./pages/ToolsPage"));
const WealthFluentHomepage = lazy(() => import("./pages/WealthFluentHomepage"));
const NetWorthCalculatorPage = lazy(() => import("./pages/NetWorthCalculatorPage"));
const GoalPlannerPage = lazy(() => import("./pages/GoalPlannerPage"));
const GoalsPage = lazy(() => import("./pages/GoalsPage"));
const FinancialProfilePage = lazy(() => import("./pages/FinancialProfilePage"));

const GoalSIPCalculatorPage = lazy(() => import("./pages/GoalSIPCalculatorPage"));
const AnnualRetirementIncomePage = lazy(() => import("./pages/AnnualRetirementIncomePage"));
const BondYieldCalculatorPage = lazy(() => import("./pages/BondYieldCalculatorPage"));
const FutureValueCalculatorPage = lazy(() => import("./pages/FutureValueCalculatorPage"));
const InflationCalculatorPage = lazy(() => import("./pages/InflationCalculatorPage"));
const RateOfReturnCalculatorPage = lazy(() => import("./pages/RateOfReturnCalculatorPage"));
const RetirementInvestmentTrackerPage = lazy(() => import("./pages/RetirementInvestmentTrackerPage"));
const WealthAgeCalculatorPage = lazy(() => import("./pages/WealthAgeCalculatorPage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage"));
const SitemapPage = lazy(() => import("./pages/SitemapPage"));
const VerdictIndex = lazy(() => import("./pages/verdict/VerdictIndex"));
const RentVsBuyPage = lazy(() => import("./pages/verdict/RentVsBuyPage"));
const DebtVsInvestPage = lazy(() => import("./pages/verdict/DebtVsInvestPage"));
const LeaseVsBuyPage = lazy(() => import("./pages/verdict/LeaseVsBuyPage"));
const InsuranceNeedPage = lazy(() => import("./pages/verdict/InsuranceNeedPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
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
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/quizzes" element={<QuizzesPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/learn/:slug" element={<LessonPage />} />
            <Route path="/sip-calculator" element={<SIPCalculatorPage />} />
            <Route path="/emi-calculator" element={<EMICalculatorPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/fd-calculator" element={<FDCalculatorPage />} />
            <Route path="/cagr-calculator" element={<CAGRCalculatorPage />} />
            <Route path="/gst-calculator" element={<GSTCalculatorPage />} />
            <Route path="/retirement-calculator" element={<RetirementCalculatorPage />} />
            <Route path="/calculators" element={<CalculatorsPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/fire-calculator" element={<FIRECalculatorPage />} />
            <Route path="/networth-calculator" element={<NetWorthCalculatorPage />} />
            <Route path="/goal-planner" element={<GoalPlannerPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/financial-profile" element={<FinancialProfilePage />} />
            
            <Route path="/goal-sip" element={<GoalSIPCalculatorPage />} />
            <Route path="/annual-retirement-income" element={<AnnualRetirementIncomePage />} />
            <Route path="/bond-yield-calculator" element={<BondYieldCalculatorPage />} />
            <Route path="/future-value-calculator" element={<FutureValueCalculatorPage />} />
            <Route path="/inflation-calculator" element={<InflationCalculatorPage />} />
            <Route path="/rate-of-return-calculator" element={<RateOfReturnCalculatorPage />} />
            <Route path="/wealth-age-calculator" element={<WealthAgeCalculatorPage />} />
            <Route path="/retirement-investment-tracker" element={<RetirementInvestmentTrackerPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/verdict" element={<VerdictIndex />} />
            <Route path="/verdict/rent-vs-buy" element={<RentVsBuyPage />} />
            <Route path="/verdict/debt-vs-invest" element={<DebtVsInvestPage />} />
            <Route path="/verdict/lease-vs-buy-car" element={<LeaseVsBuyPage />} />
            <Route path="/verdict/insurance-need" element={<InsuranceNeedPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/emergency-fund-calculator" element={<EmergencyFundCalculatorPage />} />
          </Route>
          <Route path="/journeys/home-buying" element={<HomeBuyingJourney />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
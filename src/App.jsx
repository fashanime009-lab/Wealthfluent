import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogsPage";
import BlogsPage from "./pages/BlogsPage";
import CAGRCalculatorPage from "./pages/CAGRCalculatorPage";
import CalculatorsPage from "./pages/CalculatorsPage";
import ContactPage from "./pages/ContactPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import EMICalculatorPage from "./pages/EMICalculatorPage";
import FDCalculatorPage from "./pages/FDCalculatorPage";
import FIRECalculatorPage from "./pages/FIRECalculatorPage";
import GSTCalculatorPage from "./pages/GSTCalculatorPage";
import NewsPage from "./pages/NewsPage";

import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import QuizzesPage from "./pages/QuizzesPage";
import RetirementCalculatorPage from "./pages/RetirementCalculatorPage";
import SIPCalculatorPage from "./pages/SIPCalculatorPage";
import SIPWealthArticle from "./pages/articles/SIPWealthArticle";
import ScrollToTop from "./components/ScrollToTop";
import ToolsPage from "./pages/ToolsPage";


import WealthFluentHomepage from "./pages/WealthFluentHomepage";
import NetWorthCalculatorPage from "./pages/NetWorthCalculatorPage";
import GoalPlannerPage from "./pages/GoalPlannerPage";
import GoalSIPCalculatorPage from "./pages/GoalSIPCalculatorPage";
import AnnualRetirementIncomePage from "./pages/AnnualRetirementIncomePage";
import BondYieldCalculatorPage from "./pages/BondYieldCalculatorPage";
import FutureValueCalculatorPage from "./pages/FutureValueCalculatorPage";
import InflationCalculatorPage from "./pages/InflationCalculatorPage";
import RateOfReturnCalculatorPage from "./pages/RateOfReturnCalculatorPage";
import RetirementInvestmentTrackerPage from "./pages/RetirementInvestmentTrackerPage";
import HelpPage from "./pages/HelpPage";
import FeedbackPage from "./pages/FeedbackPage";
import SitemapPage from "./pages/SitemapPage";
import HomepageV2 from "./pages/HomepageV2";
import WorkspacePage from "./pages/WorkspacePage";
import NetWorthPage from "./pages/NetWorthPage";
import HomeBuyingJourney from "@/journeys/home-buying/pages/HomeBuyingJourney";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
         <Route element={<Layout />}>
        <Route path="/" element={<WealthFluentHomepage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/quizzes" element={<QuizzesPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blog" element={<BlogPage />} />
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
        <Route path="/NetWorthPage" element={<NetWorthPage />} />
        <Route
  path="/journeys/home-buying"
  element={<HomeBuyingJourney />}
/>
        </Route>
      </Routes>
      
    </BrowserRouter>
  );
}

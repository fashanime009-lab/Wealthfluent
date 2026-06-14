import { BrowserRouter, Route, Routes } from "react-router-dom";

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
import PortfolioTrackerPage from "./pages/PortfolioTrackerPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import QuizzesPage from "./pages/QuizzesPage";
import RetirementCalculatorPage from "./pages/RetirementCalculatorPage";
import SIPCalculatorPage from "./pages/SIPCalculatorPage";
import SIPWealthArticle from "./pages/articles/SIPWealthArticle";
import ScrollToTop from "./components/ScrollToTop";
import ToolsPage from "./pages/ToolsPage";
import WealthAgeCalculatorPage from "./pages/WealthAgeCalculatorPage";
import WealthDashboardPage from "./pages/WealthDashboardPage";
import WealthFluentHomepage from "./pages/WealthFluentHomepage";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
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
        <Route path="/wealth-dashboard" element={<WealthDashboardPage />} />
        <Route path="/fire-calculator" element={<FIRECalculatorPage />} />
        <Route path="/wealth-age-calculator" element={<WealthAgeCalculatorPage />} />
        <Route path="/portfolio-tracker" element={<PortfolioTrackerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";

import WealthFluentHomepage from "./pages/WealthFluentHomepage";
import SIPCalculatorPage from "./pages/SIPCalculatorPage";
import EMICalculatorPage from "./pages/EMICalculatorPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import DisclaimerPage from "./pages/DisclaimerPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FDCalculatorPage from "./pages/FDCalculatorPage";
import CAGRCalculatorPage from "./pages/CAGRCalculatorPage";
import GSTCalculatorPage from "./pages/GSTCalculatorPage";
import RetirementCalculatorPage from "./pages/RetirementCalculatorPage";
import SIPWealthArticle from "./pages/articles/SIPWealthArticle";
import BlogPage from "./pages/BlogPage";
import CalculatorsPage from "./pages/CalculatorsPage";
import ToolsPage from "./pages/ToolsPage";
import WealthDashboardPage from "./pages/WealthDashboardPage";
import ScrollToTop from "./components/ScrollToTop";
import FIRECalculatorPage from "./pages/FIRECalculatorPage";
import WealthAgeCalculatorPage from "./pages/WealthAgeCalculatorPage";
import PortfolioTrackerPage from "./pages/PortfolioTrackerPage";

export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<WealthFluentHomepage />} />
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
        <Route path="/blog" element={<BlogPage />} />
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
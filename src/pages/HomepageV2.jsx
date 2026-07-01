import PageContainer from "../components/layout/PageContainer";

import HeroSection from "../components/features/hero/HeroSection";

import JourneySection from "../components/features/journey/JourneySection";
import WhyFINAIW from "../components/features/home/WhyFINAIW";
import CalculatorShowcase from "../components/features/home/CalculatorShowcase";
import WorkspacePreview from "../components/features/home/WorkspacePreview";

export default function HomepageV2() {
  return (
    <main className="min-h-screen bg-slate-50">

  <PageContainer>

<HeroSection />

<WhyFINAIW />

<CalculatorShowcase />

<WorkspacePreview />

<JourneySection />

</PageContainer>

</main>
  );
}
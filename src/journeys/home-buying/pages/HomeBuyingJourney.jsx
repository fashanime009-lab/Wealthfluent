import JourneyLayout from "@/journeys/shared/layouts/JourneyLayout";
import JourneyHeader from "@/journeys/shared/components/JourneyHeader";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/components/seo/schema";

import {
  JourneyProvider,
  useJourney,
} from "@/journeys/shared/context/JourneyContext";

import homeBuyingJourney from "../data/homeBuyingJourney";

function JourneyContent() {
 const {
  currentStep,
  totalSteps,
  journey,
} = useJourney();

  const step = journey.steps[currentStep];
  const progress = Math.round(
  ((currentStep + 1) / totalSteps) * 100
);
const StepComponent = step.component;
  return (
    <JourneyLayout>
      <JourneyHeader
  eyebrow={`Step ${currentStep + 1} of ${totalSteps}`}
  title={journey.title}
  description={step.title}
/>
<div className="mb-8">

  <div className="flex justify-between text-sm text-[var(--text-secondary)]">

    <span>
      {progress}% Complete
    </span>

    <span>
      {step.title}
    </span>

  </div>

  <div className="mt-3 h-1 bg-[#111814]/10 dark:bg-[#eef1ec]/10">

    <div
      className="h-full bg-[#047857] transition-all duration-500 dark:bg-[#34d399]"
      style={{
        width: `${progress}%`,
      }}
    />

  </div>

</div>
      <section className="border border-[#111814]/12 p-6 dark:border-[#eef1ec]/12">
{StepComponent ? <StepComponent /> : null}
        
      </section>
    </JourneyLayout>
    
  );
}

export default function HomeBuyingJourney() {
  return (
    <JourneyProvider journey={homeBuyingJourney}>
      <Seo
        title="Home Buying Journey — Step-by-Step Guide"
        description="A guided, step-by-step walkthrough to help you plan a home purchase with confidence — budget, affordability, and financing all in one place."
        path="/journeys/home-buying"
        keywords="home buying guide, home affordability, house buying steps, mortgage planning"
        jsonLd={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Home Buying Journey", path: "/journeys/home-buying" },
        ])}
      />
      <JourneyContent />
    </JourneyProvider>
  );
}